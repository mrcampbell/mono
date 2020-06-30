import SalesforceService from "../SalesforceService";


// todo: convert to jsforce
export default async (accessToken: string) => {
  return SalesforceService().GetUser(accessToken);
};
