import SalesforceService from "../SalesforceService";


// todo: convert to jsforce
export default async (accessToken: string) => {
  return SalesforceService().GetUser(accessToken).then(data => {
    console.log("GET USER")

    console.log(JSON.stringify(data))
    console.log("./GET USER")
    return data
  })
};
