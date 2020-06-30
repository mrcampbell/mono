import { OAuth2 } from "jsforce";
import { TokenResponse } from "jsforce";
import SalesforceService from "../SalesforceService";

export default async (code: string): Promise<TokenResponse> => {
  return SalesforceService().RequestToken(code);
};