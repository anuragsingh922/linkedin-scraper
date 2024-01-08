// Packages
const axios = require("axios");
let setCookie = require("set-cookie-parser");

const fetchHeaders = async (cookie) => {
  try {
    // let cookie = "AQEDATezmRUEldooAAABjNtj6DoAAAGM_3BsOlYAYZrsRhfEqVW330ItGG9BXdSruy2DtcE81EuKX9rKdNnWleY_EPIHtMLS7JkHoZ47p2fB-Wecb_coVMKRNgaHwOMBds0dr-GErmIHqWXZ47Xagt1-";
    let res = await axios.get(
      "https://www.linkedin.com/feed/?trk=guest_homepage-basic_nav-header-signin"
    );
    const sid = setCookie.parse(res, {
      decodeValues: true, // default: true
      map: true, //default: false
    })["JSESSIONID"].value;
    const cookies = setCookie.parse(res, {
      decodeValues: true, // default: true
      map: true, //default: false
    });

    let cookie_string = `li_at=${cookie};`;
    for (const key in cookies) {
      cookie_string += `${key}=${cookies[key].value};`;
    }

    let headers = {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
      "csrf-token": sid,
      Cookie: cookie_string,
    };


    // console.log(JSON.stringify(headers));
    // console.log("\n\n");
    // console.log(headers["csrf-token"]);
    // console.log("\n\n");
    // console.log(headers.Cookie);

    // let c = headers.Cookie;
    // let t = headers["csrf-token"];
    

    // headers =  {
    //   "accept" : "application/vnd.linkedin.normalized+json+2.1",
    //   "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,pt;q=0.7",
    //   "csrf-token": t,
    //   "cookie": c
    // }

    // console.log("T  :  "+JSON.stringify(headers =  {
    //   "accept" : "application/vnd.linkedin.normalized+json+2.1",
    //   "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,pt;q=0.7",
    //   "csrf-token": t,
    //   "cookie": c
    // }));


    return {headers : headers, status : "success"};
  } catch (err) {
    console.log(err);
    return {headers : null, status : err.message};
  }
};

// fetchHeaders();

module.exports = fetchHeaders;
