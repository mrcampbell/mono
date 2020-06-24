import { sign } from "jsonwebtoken";
import config from "../config";

export interface TokenPayload {
  user_id: string;
}

export let signToken = (data: TokenPayload) => {
  console.log(config.server.appSecret!)
  return sign({data}, config.server.appSecret!, {expiresIn: 1000 * 60 * 30})
}