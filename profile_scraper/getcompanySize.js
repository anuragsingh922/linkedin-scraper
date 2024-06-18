const axios = require("axios");
const cheerio = require("cheerio");

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

const getcompany_size = async (jobUrl, companysize) => {
  try {
    if (jobUrl && jobUrl.length > 0) {
      console.log("Fetching Company Size");
      const array_with_company_size = [];

      for (let i = 0; i < jobUrl.length; i++) {
        if (jobUrl[i]["companyurl"] && jobUrl[i]["companyurl"] != "null") {
          const headers = {
            accept: "*/*",
            "accept-language": "en-GB,en;q=0.9",
          };
          await wait(30000);
          const res = await axios.get(jobUrl[i]["companyurl"], {
            headers,
          });
          if (res.data) {
            const $ = cheerio.load(res.data);

            if ($) {
              const compant_size = $(".face-pile__cta").text().trim();

              if (compant_size) {
                let match;

                if (compant_size.includes("employees")) {
                  match = compant_size.match(/View all (\d+) employees/);
                } else {
                  match = compant_size.match(/View (\d+) employee/);
                }

                if (match) {
                  const numberOfEmployees = match ? match[1] : null;

                  if (numberOfEmployees) {
                    console.log("Company Size : " + numberOfEmployees);
                    jobUrl[i]["size"] = numberOfEmployees;
                    console.log("Input size : " + companysize);
                    if (companysize == "Small") {
                      if (numberOfEmployees <= 200) {
                        array_with_company_size.push(jobUrl[i]);
                      }
                    } else if (companysize == "Medium") {
                      if (
                        numberOfEmployees > 200 &&
                        numberOfEmployees <= 5000
                      ) {
                        array_with_company_size.push(jobUrl[i]);
                      }
                    } else if (companysize == "Large") {
                      array_with_company_size.push(jobUrl[i]);
                    } else {
                    }
                  }
                }
              }
            }
          }
        }
      }
      console.log("jonUrl Size ");
      console.log(jobUrl);

      return array_with_company_size;
    } else {
      return [];
    }
  } catch (err) {
    console.error("Error while fetching company info:", err.message);
    return [];
  }
};

module.exports = { getcompany_size };
