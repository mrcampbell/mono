import { Connection } from "jsforce";

const axios = require("axios").default;

// todo: convert to jsforce
export default async (accessToken: string) => {
  return new Promise(async (resolve, reject) => {
    await axios
      .get("https://login.salesforce.com/services/oauth2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res: any) => {
        return resolve(res.data);
      })
      .catch(reject);
  });
};
