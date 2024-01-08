const axios = require("axios");
const cheerio = require("cheerio");
const he = require("he");
const fetchHeaders = require("./fetchHeaders");

const fetchCompanyIdFromUrl = async (headers, companyUrl) => {
  try {
    const url = companyUrl;
    const res = await axios.get(url, {
      headers,
    });

    const $ = cheerio.load(res.data);

    const commentContent = $("code#flagshipOrganizationTracking").html();

    // Decode HTML entities using 'he'
    const decodedContent = he.decode(commentContent);

    // Extract the JSON content inside the comment
    const jsonMatch = decodedContent.match(/<!--(.+?)-->/);

    let id;

    if (jsonMatch && jsonMatch[1]) {
      try {
        // Parse the JSON inside the comment
        const jsonContent = JSON.parse(jsonMatch[1]);
        // Extract the company ID
        id = jsonContent.organization.objectUrn.split(":").pop();
      } catch (error) {
        console.error("Error parsing JSON:", error.message);
      }
    } else {
      console.log("No JSON content found inside the comment.");
      return { status: "error" };
    }
    return { id: id, status: "success" };
  } catch (err) {
    console.log("Error while fetching company ID : ", err.message);
    return { status: "error" };
  }
};

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

const get_jobs = async (
  job_title,
  location,
  jobposition,
  session_cookie,
  joblisting
) => {

  try {
    // const headers = await fetchHeaders(session_cookie);

    // console.log("Headers : " +headers.headers.Cookie);

    const json = [];
    const processedCompany = [];
    
    for (let i = 0; i < joblisting; i += 25) {
      const response = await axios.get(
        `https://in.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/${job_title}-jobs-${location}?trk=homepage-jobseeker_suggested-search&start=${i}`,
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-GB,en;q=0.9",
          },
        }
      );

      //   const html = await response.text();
      //   console.log("HTML  :  " + response.data);

      // const html = await response.text;
      const $ = cheerio.load(response.data);
      const jobs = $(".job-search-card");
      jobs.each((i, job) => {
        const id = $(job).attr("data-entity-urn")?.split(":")?.[3];

        const title = $(job).find(".base-search-card__title")?.text()?.trim();

        const company = $(job)
          .find(".base-search-card__subtitle")
          .text()
          .trim();

        const companyurl = $(job)
          .find(".base-search-card__subtitle")
          .find("a")
          .attr("href")
          ?.split("?")[0];

        const link = $(job).find("a").attr("href")?.split("?")[0];

        const location = $(job)
          .find(".job-search-card__location")
          .text()
          .trim();

        if (json.length< joblisting) {
          json.push({ id, link, title, company, location, companyurl });
        }
      });

      await wait(2000);
    }


    for (let i = 0; i < json.length; i++) {
      const companyurl = json[i]?.companyurl;
      console.log(processedCompany);

      let processed = false;

      for (let j = 0; j < processedCompany.length; j++) {
        if (processedCompany[j].companyurl == companyurl) {
          console.log("Same");
          json[i].id = "null";
          processed = true;
        }
      }

      if (!processed) {
        processedCompany.push(json[i]);

        console.log(companyurl);

        await wait(5000);

        const res = await fetchCompanyIdFromUrl(headers, companyurl);
        if (res.status === "success") {
          json[i].id = res.id;
        } else {
          json[i].id = "null";
        }
      }
      if(processedCompany.length>=joblisting){
        break;
      }
    }
    console.log(json);

    res.send( { head: headers.headers, companies: json, status: "success" });
  } catch (error) {
    console.log("error searching jobs", error.message);
    res.send( { error: error.message, status: "error" });
  }
};

// fetchCompanyIdFromUrl();
// get_jobs();

module.exports = { get_jobs };
