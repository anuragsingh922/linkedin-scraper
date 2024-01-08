const axios = require("axios");
const env = require("../../env/config");
const fs = require("fs");
const google = require("google-it");

const {get_jobs} = require('../../profile_scraper/getJobs');
const {get_profile , get_profiles2} = require('../../profile_scraper/get_profiles');
const {sendConnectionRequests} = require('../../send-connection-request/getProfileID');

const target_profile_decider = async (req, res) => {
  const prodStatement = req.body.prod_statement;
  const prod_description = req.body.problemdec;
  const jobtitle = req.body.jobtitle;

  const systemContent = `You will be given a problem statement and a description of the product or service our company has built to solve the problem.
  Your task is to figure out which profiles you should target to sell the product or service to.
  The profiles should be specific enough to be actionable. For example, "data scientist" is not a specific enough profile, because they have no say in the purchasing process.
  On the other hand, "VP of Engineering" is too specific, because there are not enough of them to target.
  Return the target profiles in a list. Make sure to limit it to only six profiles.
  follow this format only:
  format: 
  1. profile1 job title
  2. profile2 job title
  3. profile3 job title
  4. profile4 job title
  5. pofile5 job title
  6. profile6 job title
  Only name their job title`; // Replace with your system content
  const userContent = `Problem Statement: ${prodStatement}\n Product description: ${prod_description} \n Job Title : ${jobtitle} \n\ntarget profiles: `;

  const m1 = [
    { role: "system", content: systemContent },
    { role: "user", content: userContent },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        max_tokens: 100,
        temperature: 0.8,
        messages: m1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.api_key}`,
        },
      }
    );

    let generatedTargetProfiles = response.data.choices[0].message.content;

    console.log("Profiles  :  " + generatedTargetProfiles);

    // Assuming generatedTargetProfiles is the string containing the profiles
    const text = `${generatedTargetProfiles}`;
    const pattern = /\d+\.\s+(.+)/g;
    const matches = text.match(pattern);

    const generatedTargetProfilesArray = matches
      ? matches.map((match) => match.trim())
      : [];
    console.log(generatedTargetProfilesArray);

    res.send({
      result: generatedTargetProfilesArray,
    });
  } catch (error) {
    res.json({
      err: "Any error occures",
    });

    console.error(error.message);
  }
};

const target_persona_decider = async (req, res) => {
  const userResponse = req.body.user_response;
  const systemContent = `
  You will be given a user response, you have to figure out the target profiles the user is looking for. Once you have found them return them using the word OR as a seperator.
  Only limit the target persona to 6. Any more than that please avoid and dont include them. Only consider the first six.
  Example:
  user: I'm thinking data scientist and maybe one full stack engineer
  target_persona: Data Scientist OR Full Stack Engineer

  Example:
  user: I guess ceo, cto and a HR manager.
  target_persona: CEO OR CRO OR HR manager

  Example:
  user: ceo, cto, cfo, head of sals, vp sales, sales enablement and data scientist and full stack
  target_persona: CEO OR CTO OR CFO OR Head of Sales OR VP Sales ORSales Enablement
    `;

  const userContent = `${userResponse} \ntarget_persona: `;

  const messages = [
    { role: "system", content: systemContent },
    { role: "user", content: userContent },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        max_tokens: 100,
        temperature: 0.8,
        messages: messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.api_key}`,
        },
      }
    );

    const targetPersona = response.data.choices[0].message.content;
    res.send({ result: targetPersona });
  } catch (error) {
    console.error(error + error.message);
    throw error;
  }
};

const industries_path = async (req, res) => {
  const userChoice = req.body.user_choice;

  console.log("User Choice  :  " + userChoice);
  let industryOptions;

  if (userChoice.includes("No")) {
    const prodStatement = req.body.prod_statement;
    const prodDescription = req.body.prod_description;
    const systemContent = `
        You are given a problem statement and a solution that our company has built.
        Your task is to generate 10 company categories or sectors that would be interested in the solution we're offering.
        Only return the company or sector names and nothing else. No explanation is required.
        Arrange the terms in descending order of relevance.
        Follow this format to present your answer.
        Format:
        1. <company category 1>
        2. <company category 2>
        3. <company category 3>
        4. <company category 4>
        5. <company category 5>
        6. <company category 6>
        7. <company category 7>
        8. <company category 8>
        9. <company category 9>
        10. <company category 10>
        `;

    const userContent = `Problem statement: ${prodStatement}\nproduct description: ${prodDescription}\nsearch term:`;

    const messages = [
      { role: "system", content: systemContent },
      { role: "user", content: userContent },
    ];

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          max_tokens: 100,
          temperature: 0.8,
          messages: messages,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.api_key}`,
          },
        }
      );

      industryOptions = response.data.choices[0].message.content;
      console.log("Industries Options  :  " + JSON.stringify(industryOptions));

      const text = `${industryOptions}`;
      const pattern = /\d+\.\s+(.+)/g;
      const matches = text.match(pattern);

      industryOptions = matches ? matches.map((match) => match.trim()) : [];
    } catch (error) {
      console.error(error);
      throw error;
    }
  } else {
    const messages = [
      {
        role: "system",
        content: `You will be given a user response. Your task is to figure out what companies the user has mentioned and return them in an array. If no companies are found or the input is not recognized, return companies with call centers from any country. Return only the array and nothing else.`,
      },
      { role: "user", content: `User: ${userChoice}\nCompanies:` },
    ];

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          max_tokens: 100,
          temperature: 0.8,
          messages: messages,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.api_key}`,
          },
        }
      );

      industryOptions = JSON.parse(response.data.choices[0].message.content);
      console.log("Industries Options  :  " + JSON.stringify(industryOptions));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  res.send({ result: industryOptions });
};

const update_industry_option = async (req, res) => {
  const industryOptions = req.body.industries;
  const userResponse = req.body.choices;
  let updatedIndustryOptions;

  const messages = [
    {
      role: "system",
      content:
        "You will be given a system-generated answer and changes requested by the user. You have to return the new answer after applying the said changes in the same format you received the data in. It may happen that the user might only choose a single industry or an entirely different industry not present in the given options. Then only return the single industry or the new industry mentioned by the user. No need to include everything.",
    },
    {
      role: "user",
      content: `System-generated response: ${industryOptions}\nUser request: only ${userResponse}\nChanged Answer:`,
    },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        max_tokens: 100,
        temperature: 0.8,
        messages: messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.api_key}`,
        },
      }
    );

    updatedIndustryOptions = response.data.choices[0].message.content;
    const text = `${updatedIndustryOptions}`;
    const pattern = /\d+\.\s+(.+)/g;
    const matches = text.match(pattern);

    updatedIndustryOptions = matches
      ? matches.map((match) => match.trim())
      : [];

    console.log("Content  :  " + updatedIndustryOptions);
  } catch (error) {
    console.error(error);
    throw error;
  }

  res.send({ result: updatedIndustryOptions });
};

function reset() {
  const filesToDelete = [
    "profile_list.csv",
    "profiles_with_email_phone.csv",
    "profiles_with_emails.csv",
    "company.csv",
    "companies.csv",
    "profile.csv",
    "profiles.csv",
  ];

  filesToDelete.forEach((filename) => {
    try {
      if (fs.existsSync(filename)) {
        fs.unlinkSync(filename);
        console.log(`Deleted file: ${filename}`);
      }
    } catch (error) {
      console.error(`Error deleting file ${filename}: ${error.message}`);
    }
  });
}

// function searchLinkGenerator(location, keyword, companySize) {
//   let totalCompanySize = "5B%";

//   console.log("Search Link   :  " + keyword);

//   for (const size of companySize) {
//     totalCompanySize += env.size_of_company[size].slice(3) + "%2C%";
//   }

//   const locationId = env.locations[location.toLowerCase()];

//   // console.log(
//   //   `https://www.linkedin.com/search/results/companies/?companyHqGeo=%5B%${locationId}%22%5D&companySize=%${totalCompanySize.slice(
//   //     0,
//   //     -4
//   //   )}%5D&keywords=${keyword}&origin=FACETED_SEARCH&sid=9YG`
//   // );

//   return `https://www.linkedin.com/search/results/companies/?companyHqGeo=%5B%${locationId}%22%5D&companySize=%${totalCompanySize.slice(
//     0,
//     -4
//   )}%5D&keywords=${keyword}&origin=FACETED_SEARCH&sid=9YG`;
// }

function searchLinkGenerator(location, keyword, companySize) {
  let totalCompanySize = "5B%";
  // const location = "United States";

  // const keyword = "Web Development"
  console.log("Search Link   :  " + keyword);

  // for (const size of companySize) {
  //   totalCompanySize += env.size_of_company[size].slice(3) + "%2C%";
  // }

  const locationId = env.locations[location.toLowerCase()];

  let keyw = keyword.replace(/ /g, "%20");
  console.log(keyw);

  let loc = location.replace(/ /g, "%20");

  console.log(
    `https://www.linkedin.com/jobs/search/?currentJobId=&geoId=${locationId}&keywords=Web%20Development&location=${loc}&origin=JOB_SEARCH_PAGE_LOCATION_AUTOCOMPLETE&refresh=true`
  );

  return `https://www.linkedin.com/jobs/search/?currentJobId=&geoId=${locationId}&keywords=Web%20Development&location=${loc}&origin=JOB_SEARCH_PAGE_LOCATION_AUTOCOMPLETE&refresh=true`;
}

async function profileValidator(noOfProfiles, targetPersona, profiles) {
  profiles["validJobTitle"] = "-";

  for (let i = 0; i < profiles.length; i++) {
    const systemContent = `
      You are given a job title and a list of valid job titles. If the given job title matches any of the valid job titles,
      return "y," which means "yes, it's a valid job title." If not, return "n," which means "no, it's not a valid job title."
      Please do not return anything else.

      Example 1:
      Valid job titles: Data Scientist OR Software developer OR machine learning engineer
      Job title: junior software developer at Apple
      validJobTitle: y

      Example 2:
      Valid job titles: Data Scientist OR Software developer OR machine learning engineer
      Job title: head of sales at Armani Exchange
      validJobTitle: n
    `;

    const userContent = `Valid job titles: ${targetPersona}\nJob title: ${profiles[i].job}\nValidJobTitle:`;

    for (let m = 0; m < 10; m++) {
      try {
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4",
            messages: [
              { role: "system", content: systemContent },
              { role: "user", content: userContent },
            ],
            max_tokens: 1,
            temperature: 0.8,
          },
          {
            headers: {
              Authorization: "Bearer YOUR_OPENAI_API_KEY",
            },
          }
        );

        profiles[i].validJobTitle = response.data.choices[0].message.content;
        break;
      } catch (error) {
        console.error("Failed", m, error);
        continue;
      }
    }
  }

  const validProfiles = profiles.filter(
    (profile) => profile.validJobTitle === "y"
  );

  if (validProfiles.length > parseInt(noOfProfiles, 10)) {
    return validProfiles.slice(0, parseInt(noOfProfiles, 10));
  } else {
    return validProfiles;
  }
}


const linkedin_company_scraper = async (req, res) => {
  try{
  const location = req.body.location;
  const job_field = req.body.job_field;
  const target_persona = req.body.target_persona;
  const session_cookie = req.body.session_cookie;
  const company_size = req.body.company_size;
  const no_of_profiles = req.body.no_of_profiles;
  const no_of_companies = req.body.no_of_companies;
  console.log("Location : " + location);
  console.log("Job : " + job_field);
  console.log(no_of_profiles);
  console.log(no_of_companies);
  
  // res.send([{profileUrl : "https://www.linkedin.com/in/tarun-kathpal-aa657736/"}]);
  // return;
  
  const getjob_response = await get_jobs(job_field , location , session_cookie , no_of_companies);


  if(!getjob_response.status==="success" || getjob_response.companies<=0){
    res.send([{error : "No Profile Found."}]);
    return;
  }

  const jobs_array = getjob_response.companies;
  const csrf_token = getjob_response.head["csrf-token"];
  const cookies = getjob_response.head.Cookie;

  // let job_array = [];
  // let job_array = [{
  //   publishedAt: "2023-12-15",
  //   salary: "",
  //   title: "Front End Engineer",
  //   jobUrl:
  //     "https://www.linkedin.com/jobs/view/front-end-engineer-at-lever-middleware-test-company-2-3787334783?trk=public_jobs_topcard-title",
  //   companyName: "Lever Middleware Test Company 2",
  //   companyUrl:
  //     "https://www.linkedin.com/company/target-freight-management",
  //   location: "Atlanta, GA",
  //   postedTime: "2 weeks ago",
  //   applicationsCount: "Be among the first 25 applicants",
  //   description:
  //     "Lever builds modern recruiting software for teams to source, interview, and hire top talent. Our team strives to set a new bar for enterprise software with modern, well-designed, real-time apps. We participated in Y Combinator in summer 2012, and since then have raised $73 million. As the applicant tracking system of choice for Netflix, Eventbrite, ClearSlide, change.org, and thousands more leading companies, Lever means you hire the best by hiring together.\n" +
  //     "\n" +
  //     "Lever is an equal opportunity employer. We are committed to providing reasonable accommodations and will work with you to meet your needs. If you are a person with a disability and require assistance during the application process, please don’t hesitate to reach out! We celebrate our inclusive work environment and welcome members of all backgrounds and perspectives. Learn more about our team culture and commitment to diversity and inclusion.",
  //   contractType: "Full-time",
  //   experienceLevel: "Entry level",
  //   workType: "Engineering and Information Technology",
  //   sector: "Technology, Information and Internet",
  //   companyId: "19055996",
  //   posterProfileUrl: "",
  //   posterFullName: "",
  // },
  // {
  //   publishedAt: "2023-12-16",
  //   salary: "",
  //   title: "Full Stack Software Engineer",
  //   jobUrl:
  //     "https://www.linkedin.com/jobs/view/full-stack-software-engineer-at-urban-sky-3787787177?trk=public_jobs_topcard-title",
  //   companyName: "Urban Sky",
  //   companyUrl:
  //     "https://www.linkedin.com/company/urban-sky-imaging?trk=public_jobs_topcard-org-name",
  //   location: "Denver, CO",
  //   postedTime: "2 weeks ago",
  //   applicationsCount: "72 applicants",
  //   description:
  //     "About Urban Sky:\n" +
  //     "\n" +
  //     "Urban Sky is a venture-backed aerospace startup pioneering stratospheric operations and reimagining the way humans analyze the earth. We design, build, operate, and sell stratospheric balloon systems, and the data we collect supports a wide range of applications, from real-time wildfire monitoring to urban mapping. Urban Sky sends flight vehicles to the stratosphere on a weekly basis.\n" +
  //     "\n" +
  //     "We aim to build the next chapter of stratospheric history in Denver and are seeking self-starting, open-minded, and hard-working team members.\n" +
  //     "\n" +
  //     "About the Role:\n" +
  //     "\n" +
  //     "Urban Sky is at the forefront of innovation in the aerospace industry, and as a Software Engineer, you will be a key player in our mission. Your primary responsibility will be the development of an in-house portal for managing balloon manufacturing and inventory.\n" +
  //     "\n" +
  //     "In addition to the balloon manufacturing portal, you will contribute to our mission control software, where real-time data from balloon flights is collected, analyzed, and used to make critical decisions.\n" +
  //     "\n" +
  //     "As a Software Engineer at Urban Sky, you will find yourself working on projects that demand not only technical excellence but also a deep understanding of the aerospace industry. You'll be part of a cross-functional team that includes aerospace engineers, scientists, and software professionals, collaborating closely to transform project requirements into innovative software solutions. You will play a pivotal role in creating documentation that ensures the integrity and maintainability of the software you develop. Your attention to detail and dedication to producing high-quality code will be crucial to our success.\n" +
  //     "\n" +
  //     "Key Functions:\n" +
  //     "\n" +
  //     "\n" +
  //     " * Web Portal Architecture: You will be responsible for architecting web portals using modern web development tools - Node.js, React, Typescript\n" +
  //     " * Cross-Functional Collaboration: Collaborate with diverse teams of engineers - fffective communication and teamwork are vital in this role.\n" +
  //     " * Documentation: Create comprehensive documentation for the software you develop, ensuring that it is well-documented for reference and easy maintenance.\n" +
  //     "   \n" +
  //     "   \n" +
  //     "\n" +
  //     "Skills and Experience:\n" +
  //     "\n" +
  //     "\n" +
  //     " * 5+ years of work experience, or an advanced degree plus 3 years of experience.\n" +
  //     " * Full-stack web development experience, with proficiency in the following technologies:\n" +
  //     "    * Node.js\n" +
  //     "    * React\n" +
  //     "    * Typescript\n" +
  //     "    * Postgres\n" +
  //     "    * RestAPI\n" +
  //     "    * Jest\n" +
  //     "    * Git\n" +
  //     "    * Cypress\n" +
  //     "      \n" +
  //     "\n" +
  //     "Nice to Haves:\n" +
  //     "\n" +
  //     "\n" +
  //     " * Previous experience architecting a system from the ground up, demonstrating your ability to design scalable and efficient solutions.\n" +
  //     " * Familiarity with the following additional technologies is a plus:\n" +
  //     "    * Python\n" +
  //     "    * React Query\n" +
  //     "    * tRPC\n" +
  //     "    * AWS (Lambda, ECS, EC2, etc.)\n" +
  //     "\n" +
  //     " * Located or willing to relocate to Denver, CO\n" +
  //     "   \n" +
  //     "   \n" +
  //     "\n" +
  //     "Benefits:\n" +
  //     "\n" +
  //     "\n" +
  //     " * Salary $90,000 - $140,000 per year\n" +
  //     "    * We are required to post this salary range per Colorado law. Your salary will be determined based on your abilities and experience.\n" +
  //     "\n" +
  //     " * Stock Options\n" +
  //     " * Medical, Vision and Dental\n" +
  //     " * Unlimited Vacation Days\n" +
  //     " * Cell Phone Bill Stipend\n" +
  //     "   \n" +
  //     "   \n" +
  //     "\n" +
  //     "NOTE: Research suggests that women and BIPOC individuals may self-select out of opportunities if they don’t meet 100% of the job requirements. We encourage anyone who believes that they have the skills and the passion necessary to succeed here to apply for this role.\n" +
  //     "\n" +
  //     "Must be US Citizen or Permanent Resident\n" +
  //     "\n" +
  //     "Urban Sky is an equal opportunity employer and we value diversity. All employment is decided on the basis of qualifications, merit and business need.\n" +
  //     "\n" +
  //     "Powered by JazzHR\n" +
  //     "\n" +
  //     "crGMApXh27",
  //   contractType: "Full-time",
  //   experienceLevel: "Mid-Senior level",
  //   workType: "Engineering and Information Technology",
  //   sector: "Internet Publishing",
  //   companyId: "37175305",
  //   posterProfileUrl: "",
  //   posterFullName: "",
  // }];

  // for(let i=0;i<jobs_array.length;i++){
  //   if(i>10){
  //     break;
  //   }
  //   else{
  //     job_array.push(jobs_array[i]);
  //   }
  // }

  // if(job_array.length==0){
  //   res.send([{error : "no Profile Found."}]);
  //   return;
  // }


  const profile_array = await get_profiles2(jobs_array , target_persona , no_of_profiles , csrf_token , cookies);

  if(profile_array.length>0){
    res.send(profile_array);
    return;
  }
  else{
    res.send([{error : "No Profile Found."}]);
    return;
  }
}catch(err){
  console.log(err.message);
  res.send([{error : `Error occured ${err.message}`}]);
}
};







const Option = async (request, res) => {
  const message = request.body.message;
  const systemContent = `
        You will be given a user response. You have to return the intention either "YES" or "NO" by analyzing what the user has responded with.
        For "NO" st.write "n"

        For "YES" st.write "y"
        Example:
        User: Nah.. I don't like it
        Intention: n

        User: sounds good.
        Intention: y
    `;

  const userContent = `${message}\nIntention: `;
  const messages = [
    { role: "system", content: systemContent },
    { role: "user", content: userContent },
  ];

  let response;

  try {
    const result = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        max_tokens: 5,
        temperature: 0.8,
        messages: messages,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.api_key}`,
        },
      }
    );

    response = result.data.choices[0].message.content;

    const intention = response.includes("n") ? "No" : "Yes";

    res.send({ response: intention });
  } catch (error) {
    console.error(error);
  }
  // }

  // Check for the presence of "n" in the response
};

const generate_connection_message = async (req, res) => {
  try {
    const { prod_statement, prod_description, changes  , } = req.body;

    const system_content = `You are given a problem statement and a description of the product that our company has built to solve the problem.
      We're trying to connect with professionals on Linkedin to promote our product. Generate a connection message to send to them.
      The message should generate interest for our product.
      Linkedin only allows 300 characters, so keep the message short. Instead of using [name], use #firstName#
      ${changes}
      Example:
      Hi #firstName#,
      <message content>
      Thank you.`;

    const user_content = `Problem Statement: ${prod_statement} \nProduct description: ${prod_description} \nConnection Message: `;

    const messages = [
      { role: "system", content: system_content },
      { role: "user", content: user_content },
    ];

    let connection_message;

    // for (let i = 0; i < 10; i++) {
    try {
      const result = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          max_tokens: 100,
          temperature: 0.8,
          messages,
        },
        {
          headers: {
            Authorization: `Bearer ${env.api_key}`,
            // Add your OpenAI API key here
          },
        }
      );

      connection_message = result.data.choices[0].message.content;
    } catch (error) {
      console.log(error);
    }

    return { result: connection_message };
    // res.send({ result: connection_message });
  } catch (error) {
    return { error: "Internal Server Error" };
    // res.status(500).json({ error: "Internal Server Error" });
  }
};


const get_connection_message = async (jobdec , prod_statement , prod_description , changes) => {
  try {

    const system_content = `You are given a problem statement and a description of the product that our company has built to solve the problem. Your task is to connect with LinkedIn professionals and promote a product. This product effectively tackles the challenges highlighted in a LinkedIn job posting with the provided job description. The connection message must be concise, generating interest in the product. Use #firstName# instead of [name]. Keep in mind that LinkedIn limits messages to 200 characters.
      We're trying to connect with professionals on Linkedin to promote our product. Generate a connection message to send to them.
      The message should generate interest for our product.
      Linkedin only allows 200 characters, so keep the message short. Instead of using [name], use #firstName#
      ${changes}
      Example:
      Hi #firstName#,
      <message content>
      Thank you.`;

    const user_content = `Problem Statement: ${prod_statement} \nProduct description: ${prod_description} \n Job Description : ${jobdec} \nConnection Message: `;

    const messages = [
      { role: "system", content: system_content },
      { role: "user", content: user_content },
    ];

    let connection_message;

    // for (let i = 0; i < 10; i++) {
    try {
      const result = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          max_tokens: 100,
          temperature: 0.8,
          messages,
        },
        {
          headers: {
            Authorization: `Bearer ${env.api_key}`,
            // Add your OpenAI API key here
          },
        }
      );

      connection_message = result.data.choices[0].message.content;
    } catch (error) {
      console.log(error);
    }

    return connection_message;
    // res.send({ result: connection_message });
  } catch (error) {
    return null;
    // res.status(500).json({ error: "Internal Server Error" });
  }
};

// const get_emails = async (req, res) => {
//   const reqData = req.body;
//   const profiles = reqData.profiles;

//   for (let i = 0; i < profiles.length; i++) {
//     const firstName = profiles[i]["firstName"];
//     const lastName = profiles[i]["lastName"];
//     const companyName = profiles[i]["company"];

//     try {
//       const { email, score } = emailFinder(firstName, lastName, companyName);
//       profiles[i]["email"] = email;
//       profiles[i]["score"] = score;
//     } catch (error) {
//       profiles[i]["email"] = "not found";
//       profiles[i]["score"] = "not found";
//     }
//   }

//   const validEmailList = profiles.filter(
//     (entry) => entry["email"] !== "not found"
//   );

//   if (validEmailList.length === 0) {
//     const result = { status: "No emails found", emails: [] };
//     res.json(result);
//   } else {
//     const result = { status: "Emails found", emails: validEmailList };
//     res.json(result);
//   }
// };

const get_emails = async (req, res) => {
  const reqData = req.body;
  const profiles = reqData.profiles;

  for (let i = 0; i < profiles.length; i++) {
    if (!profiles[i]["query"] || !profiles[i]["companyUrl"] || !profiles[i]["firstName"] || !profiles[i]["lastName"]) {
      continue;
    }
    if (profiles[i]["profileUrl"].includes("null") || profiles[i]["query"].includes("null") || !profiles[i]["companyUrl"] || profiles[i]["companyUrl"].includes("null")) {
      continue;
    }
    const firstName = profiles[i]["firstName"];
    const lastName = profiles[i]["lastName"];
    const companyName = profiles[i]["query"];

    const match = companyName.match(/\/company\/([^\/]+)/);

    // Check if there is a match and get the company name
    const companyname = match ? match[1] : null;

    try {
      const { email, score } = await emailFinder(
        firstName
          .replace(`"`, ``)
          .replace(`"`, ``)
          .replace(`"`, ``)
          .replace(`"`, ``)
          .replace("\\", "")
          .replace("\\", "")
          .replace("\\", ""),
        lastName
          .replace(`"`, ``)
          .replace(`"`, ``)
          .replace(`"`, ``)
          .replace(`"`, ``)
          .replace("\\", "")
          .replace("\\", "")
          .replace("\\", ""),
        companyname
      );
      console.log("Email  : " + email + "Score  :  " + score);
      profiles[i]["email"] = email;
      profiles[i]["score"] = score;
    } catch (error) {
      profiles[i]["email"] = "not found";
      profiles[i]["score"] = "not found";
      console.log(error.message);
    }
  }

  // const validEmailList = profiles.filter(
  //   (entry) => entry["email"] !== "not found"
  // );

  const validEmailList = [];

  for(let i=0;i<profiles.length;i++){
    if(profiles[i]["email"]){
      validEmailList.push(profiles[i]);
    }
  }

  if (validEmailList.length === 0) {
    const result = { status: "No emails found", emails: [] };
    console.log(result);
    res.send(result);
  } else {
    const result = { status: "Emails found", emails: validEmailList };
    console.log(result);
    res.send(result);
  }
};

const sendConnectionRequest = async (req, res) => {
  reset(); // Assuming reset is a function defined elsewhere in your code
  const reqData = req.body; // Assuming request is available in your environment
  const sessionCookie = reqData.session_cookie;
  const linkedinUrl = reqData.linkedin_url;
  const message = reqData.message;

  let any_connection_sent = false;

  // let sessionCookie =
  //   "AQEDATfRMyoFsT8uAAABjMtXUGgAAAGM72PUaFYAF8VxwY4co2gNpgEO5iBOdYxfVMdpx_PhZMZbQvfd9eByCbCZsI-q54qc5LOjNLXxbGcEKzX3Bohc-Ge92UfuQZNXYifxu1q1BcxdOxqby5GTiNGJ";

  // Define the API URL
  for (let i= 0 ;i<1;i++) {
  // for (const i= 0 ;i<linkedinUrl.length;i++) {
    const url = "https://api.phantombuster.com/api/v2/agents/launch";
    console.log(linkedinUrl[i]);

    const u = "https://www.linkedin.com/in/becca-fisher-4a758660/";

    // Define the payload
    const payload = {
      id: env.auto_connect_id,
      argument: {
        numberOfAddsPerLaunch: 10,
        onlySecondCircle: false,
        dwellTime: true,
        spreadsheetUrl: String(u),
        // spreadsheetUrl: String(linkedinUrl[i]),
        spreadsheetUrlExclusionList: [],
        sessionCookie: sessionCookie,
        message: message,
      },
    };

    const payload_without_message = {
      id: env.auto_connect_id,
      argument: {
        numberOfAddsPerLaunch: 10,
        onlySecondCircle: false,
        dwellTime: true,
        // spreadsheetUrl: String(linkedinUrl[i]),
        spreadsheetUrl: String(u),
        spreadsheetUrlExclusionList: [],
        sessionCookie: sessionCookie,
      },
    };

    // Define headers
    const headers = {
      "content-type": "application/json",
      "X-Phantombuster-Key": env.phantom_key, // Assuming phantomKey is defined
    };

    // Make a POST request
    const response1 = await axios.post(url, message ?  payload : payload_without_message, { headers: headers });
    const text1 = response1.data;

    // Extract the container ID
    const containerId = text1.containerId;

    console.log(containerId);

    // Define the URL to fetch output
    const fetchOutputUrl = `https://api.phantombuster.com/api/v2/containers/fetch-output?id=${containerId}`;

    // Make a GET request
    let text = "";
    let text2 = "";
    for (let m = 0; m < 60; m++) {
      const response2 = await axios.get(fetchOutputUrl, { headers: headers });
      text = response2.data;
      text2 = response2;

      if (text.output == null) {
        console.log("Working on it...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        break;
      }
    }

    if(text2.status == 200){
      console.log("Status : " + text2.status);
      any_connection_sent = true;
    }
    console.log("Connection request sent: ", i+1);
  }

  // const any_connection_sent = await sendConnectionRequests(linkedinUrl , sessionCookie , message);

  console.log(any_connection_sent);



  if(any_connection_sent){
    const result = { status: "successful" };
    res.send(result);
  }
  else{
    res.status(401).json({ error: "Error" });
  }

};


const send_connection_with_message = async (req, res) => {
  reset(); // Assuming reset is a function defined elsewhere in your code
  const reqData = req.body; // Assuming request is available in your environment
  const sessionCookie = reqData.session_cookie;
  const linkedinUrl = reqData.profiles;
  const problemStatement = reqData.problemStatement;
  const problemdec = reqData.productDes;
  const changes = reqData.changes;

  let any_connection_sent = false;


  // let sessionCookie =
  //   "AQEDATfRMyoFsT8uAAABjMtXUGgAAAGM72PUaFYAF8VxwY4co2gNpgEO5iBOdYxfVMdpx_PhZMZbQvfd9eByCbCZsI-q54qc5LOjNLXxbGcEKzX3Bohc-Ge92UfuQZNXYifxu1q1BcxdOxqby5GTiNGJ";

  // Define the API URL
  for (let i= 0 ;i<linkedinUrl.length;i++) {
  // for (const i= 0 ;i<linkedinUrl.length;i++) {
    const url = "https://api.phantombuster.com/api/v2/agents/launch";
    console.log("Description : "+linkedinUrl[i]["description"]);
    
    let message = await get_connection_message(linkedinUrl[i]["description"] , problemStatement , problemdec , changes);
    
    console.log("Message : " + message);

    message = Buffer.from(message, 'utf-8');
    
    const urlWithoutQuery = new URL(linkedinUrl[i]["ProfileUrl"]).origin + new URL(linkedinUrl[i]["ProfileUrl"]).pathname;
    
    console.log("Url : "+ urlWithoutQuery);
    // Define the payload
    const payload = {
      id: env.auto_connect_id,
      argument: {
        numberOfAddsPerLaunch: 10,
        onlySecondCircle: false,
        dwellTime: true,
        spreadsheetUrl: urlWithoutQuery,
        spreadsheetUrlExclusionList: [],
        sessionCookie: sessionCookie,
        message: String(message.toString('utf-8')),
      },
    };

    const payload_without_message = {
      id: env.auto_connect_id,
      argument: {
        numberOfAddsPerLaunch: 10,
        onlySecondCircle: false,
        dwellTime: true,
        spreadsheetUrl: String(urlWithoutQuery),
        spreadsheetUrlExclusionList: [],
        sessionCookie: sessionCookie,
      },
    };

    // Define headers
    const headers = {
      "content-type": "application/json",
      "X-Phantombuster-Key": env.phantom_key, // Assuming phantomKey is defined
    };

    // Make a POST request
    const response1 = await axios.post(url, message ?  payload : payload_without_message, { headers: headers });
    const text1 = response1.data;

    // Extract the container ID
    const containerId = text1.containerId;

    console.log(containerId);

    // Define the URL to fetch output
    const fetchOutputUrl = `https://api.phantombuster.com/api/v2/containers/fetch-output?id=${containerId}`;

    // Make a GET request
    let text = "";
    let text2 = "";
    for (let m = 0; m < 60; m++) {
      const response2 = await axios.get(fetchOutputUrl, { headers: headers });
      text = response2.data;
      text2 = response2;

      if (text.output == null) {
        console.log("Working on it...");
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        break;
      }
    }

    console.log("Request : " + JSON.stringify(text));

    if(text2.status == 200){
      console.log("Status : " + text2.status);
      any_connection_sent = true;
    }
    console.log("Connection request sent: ", i+1);
  }

  console.log(any_connection_sent);



  if(any_connection_sent){
    const result = { status: "successful" };
    res.send(result);
  }
  else{
    res.status(401).json({ error: "Error" });
  }

};

const emailFinder = async (firstName, lastName, companyName) => {
  console.log("Calling Domain Finder");
  // const domain = await domainFinder(companyName);

  // try {
  //   const results = await google({
  //     query: `http://tesla.com`,
  //     maxResults: 1,
  //   });

  //   const teslaLinks = results
  //     .filter((result) => /\bTesla\b/i.test(result.link))
  //     .map((result) => result.link);

  //   console.log("Emails  :  " + JSON.stringify(teslaLinks[1]));
  //   // domain = teslaLinks[0].replace(".", "").replace(`"`, ``).replace(`"`, ``);
  //   domain = teslaLinks[0].replace(".", "").replace(`"`, ``).replace(`"`, ``);

  //   console.log("Dom  :  " + domain);
  // } catch (error) {
  //   console.log("Error in domain finder  :  " + error.message);
  // }

  const apiKey = env.hunter_api_key; // Replace with your Hunter.io API key

  // Email Finder API
  const emailFinderUrl = "https://api.hunter.io/v2/email-finder";
  const emailFinderParams = {
    // domain : companyName,
    domain: "http://tesla.com",
    first_name: firstName,
    last_name: lastName,
    api_key: apiKey,
  };

  try {
    const emailFinderResponse = await axios.get(emailFinderUrl, {
      params: emailFinderParams,
    });
    const emailFinderData = emailFinderResponse.data.data;
    const email = emailFinderData.email;
    const score = emailFinderData.score;

    // Email Verifier API
    const emailVerifierUrl = "https://api.hunter.io/v2/email-verifier";
    const emailVerifierParams = {
      email,
      api_key: apiKey,
    };

    const emailVerifierResponse = await axios.get(emailVerifierUrl, {
      params: emailVerifierParams,
    });
    const emailVerifierData = emailVerifierResponse.data.data;

    if (emailVerifierData.status === "valid") {
      console.log("Email  :  " + email + "Valid  :  " + score);
      return { email, score };
    } else {
      throw new Error("Email verification failed.");
    }
  } catch (error) {
    console.log("Error:", error.message);
    // throw error;
  }
};

const generateEmailSubject = async (req, res) => {
  const reqData = req.body;

  const systemContent = `You are given a problem statement and a description of the product that our company has built to solve the problem.
    We're trying to connect with professionals via their email to promote our product. Generate an email subject line to send to them.
    Make sure you keep the subject short and simple.`;

  const userContent = `Problem Statement: ${reqData.prod_statement} \nProduct description: ${reqData.prod_description} \nEmail subject: `;

  const m1 = [
    { role: "system", content: `${systemContent}` },
    { role: "user", content: `${userContent}` },
  ];

  try {
    const result = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        max_tokens: 100,
        temperature: 0.8,
        messages: m1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.api_key}`,
        },
      }
    );

    const emailSubject = result.data.choices[0].message.content;
    res.send({ subject: emailSubject });
  } catch (error) {
    console.error(error);
    res.send({ subject: "Unable to generate email subject" });
  }
};

function domainFinder(companyName) {
  const { search } = require("duckduckgo");
  return new Promise((resolve, reject) => {
    search({ query: `${companyName} site:wikipedia.org`, maxResults: 1 })
      .then((results) => {
        const firstResult = results[0];
        if (firstResult && firstResult.link) {
          let domain = firstResult.link;
          try {
            domain = domain.replace("www.", "");
          } catch (error) {
            // Ignore if replace fails
          }
          const pattern = /https:\/\/([\w.-]+)/;
          const matches = domain.match(pattern);
          const url = matches ? matches[1] : null;
          resolve(url);
        } else {
          reject(new Error("No search results found."));
        }
      })
      .catch((error) => {
        console.error("Error:", error.message);
        reject(error);
      });
  });
}

const generateEmailContent = async (req, res) => {
  const reqData = req.body;

  const systemContent = `You are given a problem statement and a description of the product that our company has built to solve the problem.
    We're trying to connect with professionals via their email to promote our product. Generate an email content to send to them.
    Start every email with "Hi, [name]" , I will add the name later.
    This is my calendly link: [calendly_link]
    End the email with "Thank you".`;

  const userContent = `Problem Statement: ${reqData.prod_statement} \nProduct description: ${reqData.prod_description} \nEmail Content: `;

  const m1 = [
    { role: "system", content: `${systemContent}` },
    { role: "user", content: `${userContent}` },
  ];

  try {
    const result = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        max_tokens: 500,
        temperature: 0.8,
        messages: m1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.api_key}`,
        },
      }
    );

    const emailContent = result.data.choices[0].message.content;
    res.send({ content: emailContent });
  } catch (error) {
    console.error(error);
    res.send({ content: "Unable to generate email content" });
  }
};

const sendEmail = async (req, res) => {
  const mailjetApiKey = env.mailjet_api_key;
  const mailjetApiSecret = env.mailjet_api_secret;

  const reqData = req.body;

  const senderEmail = "anuragjadu922@gmail.com";
  // const senderName = reqData.sender_name;
  const senderName = "Anurag";

  const Mailjet = require("node-mailjet");

  // const mailjet = new Mailjet({
  //   apiKey: mailjetApiKey,
  //   apiSecret: mailjetApiSecret
  // });

  const mailjet = Mailjet.apiConnect(mailjetApiKey, mailjetApiSecret);

  let has_email = false;
  let has_error = false;

  // const em = [
  //   {
  //     profileUrl: '"\\"https://www.linkedin.com/in/manuel-g%C3%B6dert-3522a1136/\\""',
  //     query: '"\\"https://www.linkedin.com/company/tesla-motors/people/\\""',
  //     connectionDegree: '"\\"3rd\\""',
  //     name: '"\\"Manuel Gödert\\""',
  //     location: '"\\"Sunnyvale"',
  //     timestamp: '"\\"2024-01-01T09:59:44.666Z\\""',
  //     firstName: '"\\"Manuel\\""',
  //     lastName: '"\\"Gödert\\""',
  //     job: '"\\"Software Development Manager bei Tesla Grohmann Automation\\""',
  //     error: '"null"',
  //     email: 'mgoedert@tesla.com',
  //     score: 99
  //   },
  //   {
  //     profileUrl: '"\\"https://www.linkedin.com/in/thyagarajan-radhakrishnan-a085911/\\""',
  //     query: '"\\"https://www.linkedin.com/company/tesla-motors/people/\\""',
  //     connectionDegree: '"\\"3rd\\""',
  //     name: '"\\"Thyagarajan Radhakrishnan\\""',
  //     location: '"\\"Luxembourg\\""',
  //     timestamp: '"\\"2024-01-01T09:59:44.666Z\\""',
  //     firstName: '"\\"Thyagarajan\\""',
  //     lastName: '"\\"Radhakrishnan\\""',
  //     job: '"\\"Senior Software Engineer at Tesla\\""',
  //     error: '"null"',
  //     email: 'tradhakrishnan@tesla.com',
  //     score: 95
  //   }
  // ];

  for (let i = 0; i < reqData.emails.length; i++) {
    // for (let i = 0; i < em.length; i++) {
    // const receiverEmail = em[i]["email"];
    // const receiverName = em[i]["name"];
    const receiverEmail = reqData.emails[i]["email"];
    const receiverName = reqData.emails[i]["name"];
    if (receiverEmail) {
      has_email = true;
      if (receiverEmail.includes("null")) {
        continue;
      }

      const request = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: senderEmail,
              Name: senderName,
            },
            To: [
              {
                Email: receiverEmail,
                Name: receiverName,
              },
            ],
            Subject: reqData.subject,
            HTMLPart: `<h2>${reqData.content}</h2>`,
          },
        ],
      });

      console.log(request.body.Messages[0].Status);
      console.log(request.body.Messages[0].To[0].Email);
      if (request.body.Messages[0].Status == "success") {
        console.log(
          `Mail sent to ${request.body.Messages[0].To[0].Email} : `,
          request.body.Messages[0].Status
        );
        console.log(
          "MessageID  :  " + request.body.Messages[0].To[0].MessageID
        );
        console.log(
          "MessageUUID  :  " + request.body.Messages[0].To[0].MessageUUID
        );
        console.log(
          "MessageHref  :  " + request.body.Messages[0].To[0].MessageHref
        );
      }

      if (request.body.Messages[0].Status != "success") {
        has_error = true;
      }
    }
  }
  if (!has_email) {
    res.send({ status: "error" });
    return;
  }
  if (!has_error) {
    res.send({ status: "error" });
    return;
  }
  res.send({ status: "success" });

  // request
  //   .then((result) => {
  //     console.log(`Mail sent to ${receiverEmail}:`, result.body);
  //     if (result.body.Messages[0].Status === "success") {
  //       console.log("Success");
  //       res.send({ status: "success" });
  //     }
  //   })
  //   .catch((error) => {
  //     console.error(`Error sending mail to ${receiverEmail}:`, error);
  //     res.send({ status: "error" });
  //   });
};

const getPhone = async () => {
  const reqData = req.body;

  for (let i = 0; i < reqData.profiles.length; i++) {
    const email = reqData.profiles[i].email;

    let phoneNumbers = [];
    if (email === "none" || email === "not found") {
      phoneNumbers = ["not found", "not found", "not found"];
    } else {
      try {
        phoneNumbers = await phoneNumberFinder(email);
      } catch (error) {
        reqData.profiles[i].phone_number_1 = "not found";
        reqData.profiles[i].phone_number_2 = "not found";
        reqData.profiles[i].phone_number_3 = "not found";
      }
    }

    reqData.profiles[i].phone_number_1 = phoneNumbers[0] || "not found";
    reqData.profiles[i].phone_number_2 = phoneNumbers[1] || "not found";
    reqData.profiles[i].phone_number_3 = phoneNumbers[2] || "not found";
  }

  console.log(reqData.profiles);
  return reqData.profiles;
};

async function phoneNumberFinder(email) {
  const clearbitApiKey = "your_clearbit_api_key"; // Replace with your actual Clearbit API key
  console.log(email);

  const url = `https://person-stream.clearbit.com/v2/combined/find?email=${email}`;
  const headers = {
    Authorization: `Bearer ${clearbitApiKey}`,
  };

  try {
    const response = await axios.get(url, { headers });
    const parsedData = response.data;
    console.log(parsedData);

    // Extract phone numbers from the response object
    const phoneNumbers = parsedData.company.site.phoneNumbers || [];

    return phoneNumbers;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

module.exports = {
  target_profile_decider,
  target_persona_decider,
  industries_path,
  update_industry_option,
  linkedin_company_scraper,
  Option,
  generate_connection_message,
  sendConnectionRequest,
  get_emails,
  generateEmailSubject,
  generateEmailContent,
  sendEmail,
  getPhone,
  send_connection_with_message,
};
