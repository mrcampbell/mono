import { verify } from "jsonwebtoken";
import config from "../config";
import { TokenPayload } from "./signToken";
export = (access_token: string): TokenPayload => {
  return verify(access_token, config.server.appSecret!) as TokenPayload
}