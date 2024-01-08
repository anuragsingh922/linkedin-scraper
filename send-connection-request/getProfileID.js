const { sendConnectionRequest } = require("./sendConnectionRequest");
const { fetchProfileData } = require("./fetchProfileData");

const fetchHeaders = require("../profile_scraper/fetchHeaders");

const sendConnectionRequests = async (req, res) => {
  try {
    console.log("Run");
    // let { urls="", linkedin_cookie="", message="" } = req.body;

    let urls = [
      {
        Name: "Becca Fisher",
        ProfileUrl:
          "rekha-gupta-134228104",
        location: "Tampa, FL",
      },
      {
        Name: "Sean Flaherty",
        ProfileUrl:
          "https://www.linkedin.com/in/sean-flaherty-69369491?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAABOAD88BzT4aCmn1c4nGkrLRWN7KxyMFSrM",
        location: "Denver, CO",
      },
      {
        Name: "Deborah Weniger",
        ProfileUrl:
          "https://www.linkedin.com/in/deborah-wenigerb?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAAKc3_UBsIs0XZvE4OQVAKzcxWRCfgA5Ej4",
        location: "St Louis, MO",
      },
      {
        Name: "Benjamin Wansley",
        ProfileUrl:
          "https://www.linkedin.com/in/benjaminmwansley?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAABgeAHYBUg-9TBy_afGHCExCIvP-GJZXSkM",
        location: "Greensboro, NC",
      },
      {
        Name: "Michelle Johnson, SPHR",
        ProfileUrl:
          "https://www.linkedin.com/in/michellemccormick?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAAAULioBbtTDj_gSYD6WCWpwWVPmotF3gDI",
        location: "Tampa, FL",
      },
      {
        Name: "Mike Mohrhusen",
        ProfileUrl:
          "https://www.linkedin.com/in/michaelmohrhusen?miniProfileUrn=urn%3Ali%3Afs_miniProfile%3AACoAAANR6xcB55As3jLnoQNRJIvpqYOTYjckjFU",
        location: "Miami-Fort Lauderdale Area",
      },
    ];

    let linkedin_cookie =
      "AQEDATfRMyoAVHE2AAABjOlnLyUAAAGNDXOzJVYAiC9Pr3UjEs3vOhH5l3Qk7QmzTfaCRQh9WMJhaBVMi4c7oPGgXmOKX60xml1Sd781avwxCIXdCR2PlndCA3heBK4NYLApGGNVkphe6sVi9Vf4tn6q";

    let message = "Hello";

    const headers_res = await fetchHeaders(linkedin_cookie);

    let headers;
    let count = 0;

    if (headers_res.status == "success") {
      headers = headers_res.headers;
    }
    if (headers_res.status != "success") {
      console.log({ status: "erorr", error: "Linkedin cookie expired." });
      return { status: "error", error: "Linkedin cookie expired." };
    }

    // for (let i = 0; i < urls.length; i++) {
    for (let i = 0; i < 1; i++) {
      if (!urls[i] || !linkedin_cookie) {
        console.log("Linkedin url and cookie are required.");
        return [null, "Linkedin url and cookie are required."];
      }

      console.log("URL in getprofileID  :  "+urls[i].ProfileUrl);

      const [profile, errForProfile] = await fetchProfileData(urls[i].ProfileUrl, headers);

      if (
        errForProfile === "Maximum number of redirects exceeded" ||
        errForProfile === "Request failed with status code 999"
      ) {
        console.log(
          "Your session cookie has expired. Please update the session cookie in your profile page."
        );
        return [
          null,
          "Your session cookie has expired. Please update the session cookie in your profile page.",
        ];
      }

      if (!profile){
        console.log("Failed to fetch linkedin profile data.");
         return [null, "Failed to fetch linkedin profile data."];
        }

      // console.log(profile);

      const profileId = profile?.publicationView?.profileId;

      console.log("ProfileId  :  " + profileId);

      // send connection request
      const [success, errForSuccess] = await sendConnectionRequest(
        headers,
        message,
        profileId
      );
      if (!errForSuccess) count += 1;
      if (errForSuccess){
        console.log(errForSuccess);
        return [null, errForSuccess];
      }
      if (!success){
        console.log("Failed to send connection request");
        return [null, "Failed to send connection request"];
      }
    }
    console.log(count);
    console.log("success");
    return { status: "success", error: null };
  } catch (err) {
    console.log(err);
    return [null, err.message];
  }
};

// sendConnectionRequests();

module.exports = { sendConnectionRequests };
