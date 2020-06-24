import { OAuth2 } from "jsforce";
import { TokenResponse } from "jsforce/lib/oauth2";
import config from "../config";

export default async (code: string): Promise<TokenResponse> => {
  return new Promise(async (resolve, reject) => {
    var oauth2 = new OAuth2({
      clientId: config.salesforce.clientID,
      clientSecret: config.salesforce.clientSecret,
      redirectUri: config.salesforce.callbackURI,
    });
    await oauth2.requestToken(code).then((token: TokenResponse) => {
      resolve(token);
    }).catch(reject);
  });
};