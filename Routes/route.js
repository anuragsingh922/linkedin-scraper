const axios = require("axios");
const env = require("../env/config");
const express = require('express');

// const c = require('../complete_job_testing');

const c = require('../Routes/v1_routes/getJobs');

const d = require('../profile_scraper/get_profiles');

const sendreq = require('../send-connection-request/getProfileID');


const v1_functions = require('./v1_routes/all_functions');


const router = express.Router();

router.post('/target_profile_decider' , v1_functions.target_profile_decider);


router.post('/target_persona_decider' , v1_functions.target_persona_decider);

// router.post('/target_persona_decider' , v1_functions.target_persona_decider);

router.post('/industries' , v1_functions.industries_path);

router.post('/industries_choices' , v1_functions.update_industry_option);

router.post('/jobs' , c.get_jobs);

router.post('/company' , d.get_profiles2);

router.post('/send_connection' , v1_functions.sendConnectionRequest);
router.post('/send_connection_with_message' , v1_functions.send_connection_with_message);
// router.post('/send_connection' , sendreq.sendConnectionRequests);

router.post('/option' , v1_functions.Option);

router.post('/generate_connection_message' , v1_functions.generate_connection_message);


router.post('/generate_email_subject' , v1_functions.generateEmailSubject);

router.post('/generate_email_content' , v1_functions.generateEmailContent);


router.post('/get_emails' , v1_functions.get_emails);

router.post('/send_email' , v1_functions.sendEmail);

router.post('/get_phone' , v1_functions.getPhone);


router.post('/company_scraper' , v1_functions.linkedin_company_scraper);
// router.post('/company_scraper' , c.linkedin_company_scraper);

module.exports = router;
