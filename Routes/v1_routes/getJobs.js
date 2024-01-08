const axios = require("axios");
const cheerio = require("cheerio");
const he = require("he");

const { jobdescription } = require("./getjobDescription");

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

const get_jobs = async (req, res) => {
  try {
    const { job_title, location, jobposition, session_cookie, joblisting } =
      req.body;
    // const headers = await fetchHeaders(session_cookie);

    // console.log("Headers : " +headers.headers.Cookie);

    const json = [];
    const processedCompany = [];

    let i = 0;
    let keep = true;

    console.log("Job Title : " + job_title);
    console.log("Job location : " + location);

    while (json.length < joblisting && keep && i < 500) {
      const response = await axios.get(
        `https://in.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/${job_title}-jobs-${location}?trk=homepage-jobseeker_suggested-search&start=${i}`,
        {
          headers: {
            accept: "*/*",
            "accept-language": "en-GB,en;q=0.9",
          },
        }
      );
      console.log("Making request for jobs  : " + i);

      //   const html = await response.text();
      // console.log("HTML  :  " + response.data);

      // const html = await response.text;
      const $ = cheerio.load(response.data);
      const jobs = $(".job-search-card");

      console.log("Jobs");
      if (jobs.length <= 0) {
        keep = false;
        console.log("Empty");
      } else {
        jobs.each((i, job) => {
          const jobid = $(job).attr("data-entity-urn")?.split(":")?.[3];
          // console.log("Job ID");
          // console.log(jobid);

          const title = $(job).find(".base-search-card__title")?.text()?.trim();
          // console.log("Title");
          // console.log(title);

          const company = $(job)
            .find(".base-search-card__subtitle")
            .text()
            .trim();
          // console.log("Company");
          // console.log(company);

          const companyurl = $(job)
            .find(".base-search-card__subtitle")
            .find("a")
            .attr("href")
            ?.split("?")[0];
          // console.log("Company URL");
          // console.log(companyurl);

          const link = $(job).find("a").attr("href")?.split("?")[0];
          // console.log("Link");
          // console.log(link);

          const location = $(job)
            .find(".job-search-card__location")
            .text()
            .trim();
          // console.log("Location");
          // console.log(location);

          if (json.length < joblisting) {
            if (title.includes(jobposition)) {
              json.push({
                jobid,
                link,
                title,
                company,
                location,
                companyurl,
              });
            }
          }
        });

        i += 25;

        console.log("Every Request : ");
        console.log(json);
      }
      await wait(5000);
    }

    console.log("JSON");
    console.log(json);

    const json_with_description = await jobdescription(json);

    console.log(json_with_description);

    if (json_with_description && json_with_description.length) {
      if (json_with_description.length > 0) {
        res.send({ companies: json_with_description, status: "success" });
      } else {
        res.send({
          companies: [{ error: "No Profile Found." }],
          status: "success",
        });
      }
    } else {
      res.send({
        companies: [{ error: "No Job Listing Found." }],
        status: "error",
      });
    }
  } catch (error) {
    console.log("error searching jobs", error.message);
    res.send({ error: error.message, status: "error" });
  }
};

// fetchCompanyIdFromUrl();
// get_jobs();

module.exports = { get_jobs };
