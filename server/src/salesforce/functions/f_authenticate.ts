import { OAuth2 } from "jsforce";
import { TokenResponse } from "jsforce";
import SalesforceService from "../SalesforceService";

export default async (code: string): Promise<TokenResponse> => {
  return SalesforceService().RequestToken(code).then(data => {
    console.log("AUTHENTICATE")
    console.log(JSON.stringify(data))
    console.log("./AUTHENTICATE")
    return data
  })
};