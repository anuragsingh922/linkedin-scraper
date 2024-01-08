const axios = require("axios");
const cheerio = require("cheerio");

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

const jobdescription = async (jobUrl) => {
  try {
    // let jobUrl = [
    //     {
    //       "jobid": "3792395890",
    //       "link": "https://in.linkedin.com/jobs/view/full-stack-developer-at-vervenest-technologies-pvt-ltd-3792395890",
    //       "title": "Full Stack Developer",
    //       "company": "VerveNest Technologies Pvt Ltd",
    //       "location": "Thanesar, Haryana, India",
    //       "companyurl": "https://in.linkedin.com/company/vervenest-technologies-private-limited"
    //     },
    //     {
    //       "jobid": "3751747438",
    //       "link": "https://in.linkedin.com/jobs/view/wordpress-php-css-site-developer-at-visanswer-3751747438",
    //       "title": "WordPress/PHP/CSS Site Developer",
    //       "company": "Visanswer",
    //       "location": "Kurukshetra, Haryana, India",
    //       "companyurl": "https://in.linkedin.com/company/visanswer"
    //     },
    //     {
    //       "jobid": "3793581103",
    //       "link": "https://in.linkedin.com/jobs/view/tizen-developer-at-unisys-infosolutions-pvt-ltd-3793581103",
    //       "title": "Tizen Developer",
    //       "company": "Unisys Infosolutions Pvt Ltd",
    //       "location": "Karnal, Haryana, India",
    //       "companyurl": "https://in.linkedin.com/company/unisysinfo"
    //     },
    //     {
    //       "jobid": "3678189687",
    //       "link": "https://in.linkedin.com/jobs/view/graphic-web-designer-at-finss-furniture-private-limited-3678189687",
    //       "title": "Graphic Web Designer",
    //       "company": "Finss Furniture Private Limited",
    //       "location": "Panipat, Haryana, India",
    //       "companyurl": "https://in.linkedin.com/company/finss-furniture-private-limited"
    //     }
    //   ]

    for (let i = 0; i < jobUrl.length; i++) {
      if (jobUrl[i]["link"] && jobUrl[i]["link"] != "null") {
        const response = await axios.get(
          `${jobUrl[i]["link"]}/?originalSubdomain=in`,
          {
            headers: {
              accept: "*/*",
              "accept-language": "en-GB,en;q=0.9",
            },
          }
        );

        if (response.data) {
          const $ = cheerio.load(response.data);

          if ($) {
            const description = $(".show-more-less-html__markup").text().trim();

            if (description) {
              console.log("Description:", description);
              jobUrl[i]["Description"] = description;
            } else {
              jobUrl[i]["Description"] = "null";
            }
          }
        }

        console.log("Processing Des : " + i);

        await wait(20000);
      }
      else{
        jobUrl[i]["link"] = "null";
      }
    }

    console.log("Job URL");
    console.log(jobUrl);
    return jobUrl;
  } catch (err) {
    console.log("Error in job description  :  " + err);
  }
};

// jobdescription();

module.exports = { jobdescription };
