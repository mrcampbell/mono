import { sign } from "jsonwebtoken";
import config from "../config";

export interface TokenPayload {
  user_id: string;
}

export let signToken = (data: TokenPayload) => {
  console.log(config.server.appSecret!)
  return sign({data}, config.server.appSecret!, {expiresIn: /* 30 min: 1000 * 60 * 30 */ 1000000000000})
}