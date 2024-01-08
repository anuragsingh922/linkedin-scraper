const axios = require("axios");
const cheerio = require("cheerio");
const he = require("he");

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

const fetchCompanyIdFromUrl = async (headers, companyUrl) => {
  try {
    const url = companyUrl;
    const res = await axios.get(url, {
      headers,
    });

    const $ = cheerio.load(res.data);

    const commentContent = $("#flagshipOrganizationTracking").html();

    if (!commentContent) {
      console.log("\n\nEmpty");
    }

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
    console.log("Error while fetching company ID : ", err);
    return { status: "error" };
  }
};

const get_id = async (json, headers) => {
  try {

    let processedCompany = [];

    if (json.length) {
      for (let i = 0; i < json.length; i++) {
        const companyurl = json[i]?.companyurl;

        let processed = false;

        const processedUrls = new Set();

        if(processedUrls.has(companyurl)){
            processed = true;
            json[i].id = "null"
        }

        

        if (!processed) {
            processedUrls.add(companyurl);

          console.log(companyurl);

          let res;
          try {
            res = await fetchCompanyIdFromUrl(headers, companyurl);
          } catch (err) {
            console.log("Error in fetchid  :  " + err.message);
          }

          if (res.status === "success" && res.id) {
            console.log(res.id);
            json[i].id = res.id;
          } else {
            json[i].id = "null";
          }
          await wait(5000);
        }
      }
    }
    console.log(json);
    return json;
  } catch (err) {
    console.log("Error in get id  :  " + err.message);
    return [];
  }
};

module.exports = { get_id };
