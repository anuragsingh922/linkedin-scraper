const env = require("../env/config");
const axios = require("axios");

const fetchHeaders = require("../profile_scraper/fetchHeaders");

const { get_id } = require("./get_jobs_with_company_id");
const { getcompany_size } = require("./getcompanySize");

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

// const get_profile = async () => {
const get_profile = async (
  job_array,
  target_persona,
  session_cookie,
  no_of_profiles
) => {
  try {
    const company_job_array_with_size = job_array;
    // const target_persona = "Web developer";
    // const session_cookie =
    //   "AQEDATfRMyoDs9NfAAABjMwYN4EAAAGM8CS7gU0AbvYrMLTEeSPnYmlX8YrNsJkHV9Rdb1YbTyD4dddh1p3-3GH2j80RbAsHdbHzVe4LEGfFKEikii0fGf07_Py3ffL0oiO9Uw2De2zQyjHyT0-IxbI_";

    const pandasjs = require("pandas-js");

    let combined_employee = new pandasjs.DataFrame();

    for (let i = 0; i < company_job_array_with_size.length; i++) {
      if (company_job_array_with_size[i]["companyUrl"]) {
        const companyUrl = company_job_array_with_size[i]["companyUrl"]
          .replace("[", "")
          .replace(`"`, ``)
          .replace(`"`, ``)
          .replace(`"`, ``)
          .replace("]", "")
          .replace(`"`, ``)
          .replace(`\\`, ``)
          .replace(`\\`, ``)
          .replace("?trk=public_jobs_topcard-org-name", "");
        const companyName = company_job_array_with_size[i]["companyName"]
          .replace("[", "")
          .replace(`"`, ``)
          .replace(`"`, ``)
          .replace(`"`, ``)
          .replace("]", "")
          .replace(`"`, ``)
          .replace(`\\`, ``)
          .replace(`\\`, ``);

        if (
          companyUrl !== "null" &&
          !companyUrl.includes("null") &&
          companyUrl
        ) {
          console.log("Company Url Inside Loop  :  " + companyUrl);

          const url = "https://api.phantombuster.com/api/v2/agents/launch";

          const payload = {
            id: `${env.employee_export_id}`,
            argument: JSON.stringify({
              numberOfCompaniesPerLaunch: 10,
              // spreadsheetUrl: `https://www.linkedin.com/company/tesla-motors/people/`,
              spreadsheetUrl: `${companyUrl}`,
              sessionCookie: `${session_cookie}`,
              numberOfResultsPerCompany: 10,
              positionFilter: `${target_persona}`,
            }),
          };

          const headers = {
            "content-type": "application/json",
            "X-Phantombuster-Key": env.phantom_key,
          };

          const response11 = await axios.post(url, payload, { headers });
          const text11 = response11.data;
          console.log("Second Response line 462  :  " + JSON.stringify(text11));

          const containerIdd = text11.containerId;
          console.log(containerIdd);
          const fetchUrl = `https://api.phantombuster.com/api/v2/containers/fetch-output?id=${containerIdd}`;

          const headers2 = {
            accept: "application/json",
            "X-Phantombuster-Key": `${env.phantom_key}`,
          };

          let text = "";
          for (let m = 0; m < 60; m++) {
            const response2 = await axios.get(fetchUrl, { headers: headers2 });
            text = response2.data;
            console.log("\n\nText  :  " + JSON.stringify(text));
            if (text.output == null) {
              console.log("Still scraping...");
              await new Promise((resolve) => setTimeout(resolve, 2000));
            } else {
              break;
            }
          }

          let employe_response;

          try {
            employe_response = await axios.get(
              env.employee_export_data_download_link
            );
          } catch (err) {
            console.log("Error in employee csv.");
            console.log(err.message);
          }

          // console.log("Employee  : Line 549  :  " + JSON.stringify(response));

          if (employe_response) {
            const Pa = require("papaparse");

            const csvData = Pa.parse(employe_response.data, {
              header: true, // If the CSV file has headers
              dynamicTyping: true, // Convert numeric and boolean data to their types
            });

            // Extract data from the parsed CSV
            const rows = csvData.data;

            // Convert the array of objects to a DataFrame
            const newDataFrame = new pandasjs.DataFrame(rows);

            // Assuming combinedDataCompanies is an existing DataFrame
            combined_employee = combined_employee.append(newDataFrame);
          }
        }
      }
    }
    if (!combined_employee) {
      return [];
    }

    console.log("Data : " + JSON.stringify(combined_employee));

    if (combined_employee["_data"]["_list"]["_tail"]["array"]) {
      const c_length =
        combined_employee["_data"]["_list"]["_tail"]["array"].length;

      console.log(c_length);

      if (c_length > 0) {
        if (combined_employee["_data"]["_list"]["_tail"]["array"][0][1]._data) {
          const d_length = JSON.stringify(
            combined_employee["_data"]["_list"]["_tail"]["array"][0][1]._data
          ).split(",").length;
          console.log(d_length);

          let profile_array_without_job = [];

          for (let i = 0; i < d_length; i++) {
            profile_array_without_job.push({
              profileUrl: "",
              query: "",
              connectionDegree: "",
              name: "",
              location: "",
              timestamp: "",
              firstName: "",
              lastName: "",
              job: "",
            });
          }

          for (let i = 0; i < c_length; i++) {
            let Name;
            if (combined_employee["_data"]["_list"]["_tail"]["array"][i][0]) {
              console.log(
                "Name  :  " +
                  combined_employee["_data"]["_list"]["_tail"]["array"][i][0]
              );
              Name =
                combined_employee["_data"]["_list"]["_tail"]["array"][i][0];
            }

            if (
              !combined_employee["_data"]["_list"]["_tail"]["array"][i][1]._data
            ) {
              continue;
            }

            const arr = JSON.stringify(
              combined_employee["_data"]["_list"]["_tail"]["array"][i][1]._data
            ).split(",");
            // console.log(length);

            for (let j = 0; j < arr.length; j++) {
              let data = JSON.stringify(arr[j]);
              console.log("Data  : " + JSON.stringify(arr[j]));
              if (profile_array_without_job[j]) {
                profile_array_without_job[j][Name] = data
                  .replace("[", "")
                  .replace(`"`, ``)
                  .replace(`"`, ``)
                  .replace(`"`, ``)
                  .replace("]", "")
                  .replace(`"`, ``)
                  .replace(`\\`, ``)
                  .replace(`\\`, ``);
                // console.log(`Final Array ${Name} :  ` + job_array_without_size[i][Name]);
              }
            }
          }

          let profile_job_array_with_job = [];

          for (let i = 0; i < profile_array_without_job.length; i++) {
            // console.log(job_array_without_size[i]);

            // if ( job_array_without_size[i]['timestamp']) {
            if (
              !profile_array_without_job[i]["profileUrl"].includes("null") &&
              profile_array_without_job[i]["profileUrl"]
            ) {
              profile_job_array_with_job.push(profile_array_without_job[i]);
              // console.log("JOB  :  " + job_array_without_size[i]["job"]);
            }
          }

          // console.log(job_array_without_size);

          for (let i = 0; i < profile_job_array_with_job.length; i++) {
            console.log(profile_job_array_with_job[i]);
          }

          console.log(profile_job_array_with_job);
          if (profile_job_array_with_job.length > 0) {
            return profile_job_array_with_job;
            // console.log(profile_job_array_with_job);
          } else {
            return [];
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
    const r = [];
    return r;
  }
};

const get_profiles2 = async (req, res) => {
  try {
    const { job_array, target_persona, location, session_cookie  ,companysize} = req.body;

    const headers_res = await fetchHeaders(session_cookie);

    const headers = headers_res.headers;

    const csrf_token = headers["csrf-token"];
    const cookies = headers.Cookie;

    // console.log("Headers  :  " + JSON.stringify(csrf_token));
    // console.log("Headers  :  " + JSON.stringify(cookies));

    const array_with_company_id = await get_id(job_array, headers_res);

    
    const array_with_company_size = await getcompany_size(job_array , companysize);

    console.log("Array with id and size");
    console.log(array_with_company_size);
    console.log("Array with id and size");

    const profiles = [];
    if (array_with_company_size.length > 0) {
      for (let k = 0; k < array_with_company_size.length; k++) {
        const keyword = target_persona;
        if (array_with_company_size[k]["id"] && array_with_company_size[k]["companyurl"]) {
          const companyId = array_with_company_size[k]["id"];
          if (companyId != "null") {
            console.log("ID  :  " + companyId);

            for (let i = 0; i < 50; i += 10) {
              await wait(30000);
              const res = await axios.get(
                `https://www.linkedin.com/voyager/api/graphql?variables=(start:${i},origin:GLOBAL_SEARCH_HEADER,query:(keywords:${encodeURI(
                  keyword
                )},flagshipSearchIntent:SEARCH_SRP,queryParameters:List((key:currentCompany,value:List(${companyId})),(key:resultType,value:List(PEOPLE))),includeFiltersInResponse:false))&queryId=voyagerSearchDashClusters.0d1dfeebfce461654ef1279a11e52846`,
                {
                  headers: {
                    accept: "application/vnd.linkedin.normalized+json+2.1",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,pt;q=0.7",
                    "csrf-token": csrf_token,
                    cookie: cookies,
                  },
                }
              );

              const result = res.data.included;

              if (result) {
                console.log("Length : " + result.length);

                if (result.length > 0) {
                  for (let i = 0; i < result.length; i++) {
                    // console.log("Result : " + JSON.stringify(result[i]));

                    if (
                      result[i].template &&
                      result[i].title.text &&
                      result[i].title.text != "LinkedIn Member" &&
                      result[i].navigationUrl &&
                      result[i].secondarySubtitle.text
                    ) {
                      console.log("Enter.");

                      // if (
                      //   result[i].title.text &&
                      //   !result[i].title.text == "LinkedIn Member" &&
                      //   result[i].navigationUrl &&
                      //   result[i].secondarySubtitle.text
                      // ) {
                      const Name = result[i].title.text;
                      const url = result[i].navigationUrl;
                      const location = result[i].secondarySubtitle.text;
                      console.log(
                        "\n\nI  :  " + JSON.stringify(result[i].title.text)
                      ) + "\n\n";
                      console.log(
                        "\n\nI  :  " + JSON.stringify(result[i].navigationUrl)
                      ) + "\n\n";
                      console.log(
                        "\n\nI  :  " +
                          JSON.stringify(result[i].secondarySubtitle.text)
                      ) + "\n\n";
                      profiles.push({
                        Name: Name,
                        ProfileUrl: url,
                        location: location,
                        commpanyUrl : array_with_company_size[k]["companyurl"],
                        companysize : array_with_company_size[k]["size"],
                        description : array_with_company_size[k]["Description"]
                      });
                      // }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    else{
      for (let k = 0; k < job_array.length; k++) {
        const keyword = target_persona;
        if (job_array[k]["id"] && job_array[k]["companyurl"]) {
          const companyId = job_array[k]["id"];
          if (companyId != "null") {
            console.log("ID  :  " + companyId);

            for (let i = 0; i < 50; i += 10) {
              await wait(30000);
              const res = await axios.get(
                `https://www.linkedin.com/voyager/api/graphql?variables=(start:${i},origin:GLOBAL_SEARCH_HEADER,query:(keywords:${encodeURI(
                  keyword
                )},flagshipSearchIntent:SEARCH_SRP,queryParameters:List((key:currentCompany,value:List(${companyId})),(key:resultType,value:List(PEOPLE))),includeFiltersInResponse:false))&queryId=voyagerSearchDashClusters.0d1dfeebfce461654ef1279a11e52846`,
                {
                  headers: {
                    accept: "application/vnd.linkedin.normalized+json+2.1",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,pt;q=0.7",
                    "csrf-token": csrf_token,
                    cookie: cookies,
                  },
                }
              );

              const result = res.data.included;

              if (result) {
                console.log("Length : " + result.length);

                if (result.length > 0) {
                  for (let i = 0; i < result.length; i++) {
                    // console.log("Result : " + JSON.stringify(result[i]));

                    if (
                      result[i].template &&
                      result[i].title.text &&
                      result[i].title.text != "LinkedIn Member" &&
                      result[i].navigationUrl &&
                      result[i].secondarySubtitle.text
                    ) {
                      console.log("Enter.");

                      // if (
                      //   result[i].title.text &&
                      //   !result[i].title.text == "LinkedIn Member" &&
                      //   result[i].navigationUrl &&
                      //   result[i].secondarySubtitle.text
                      // ) {
                      const Name = result[i].title.text;
                      const url = result[i].navigationUrl;
                      const location = result[i].secondarySubtitle.text;
                      console.log(
                        "\n\nI  :  " + JSON.stringify(result[i].title.text)
                      ) + "\n\n";
                      console.log(
                        "\n\nI  :  " + JSON.stringify(result[i].navigationUrl)
                      ) + "\n\n";
                      console.log(
                        "\n\nI  :  " +
                          JSON.stringify(result[i].secondarySubtitle.text)
                      ) + "\n\n";
                      profiles.push({
                        Name: Name,
                        ProfileUrl: url,
                        location: location,
                        commpanyUrl : job_array[k]["companyurl"],
                      });
                      // }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    console.log(profiles);
    if (profiles.length > 0) {
      res.send(profiles);
    } else {
      res.send([{ error: "No Profile Found." }]);
    }
  } catch (err) {
    console.log("Error in company scrape  :  " + err.message);
    res.send([{ Error: "No Profile Found." }]);
  }
};

// get_profile();
// get_profiles2();

module.exports = { get_profile, get_profiles2 };
