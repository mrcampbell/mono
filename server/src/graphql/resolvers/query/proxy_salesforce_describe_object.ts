import { AuthenticationError } from "apollo-server"
import { Connection } from "jsforce";
import { User } from "../../../entities/User";
import { SalesforceMeta } from "../../../entities/SalesforceMeta";
import config from "../../../config";
import f_describeObject from "../../../salesforce/functions/f_describe-object";

export default async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  if (!context.authorized) {
    return new AuthenticationError("must be logged in to use")
  }

  const {salesforce_meta } = context.user as User;
  const { instance_url, access_token, refresh_token } = salesforce_meta as SalesforceMeta;
  const conn = new Connection({
    instanceUrl: instance_url,
    accessToken: access_token,
    refreshToken: refresh_token,
    oauth2: {
      clientId: config.salesforce.clientID,
      clientSecret: config.salesforce.clientSecret,
    },
  });

  return await f_describeObject(conn, args.name)  
}