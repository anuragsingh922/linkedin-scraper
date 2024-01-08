// Packages
const axios = require('axios');

const fetchProfileData = async (linkedin_url, headers) => {
  try {
    if (!linkedin_url) return [null, `Empty profile received.`];
    if (!headers) return [null, 'Headers are required.'];

    console.log("URL  :  "+linkedin_url);

    const username = linkedin_url.split('/')[4];

    const URL = `https://www.linkedin.com/voyager/api/identity/profiles/${username}/profileView`;

    const res = await axios.get(URL, { headers });
    const data = res?.data;

    return [data, null];
  } catch (err) {
    return [null, err.message];
  }
};

module.exports = {fetchProfileData};
