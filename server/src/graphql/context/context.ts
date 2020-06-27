import { getRepository } from "typeorm";
import { User } from "../../entities/User";
import decodeToken from "../../auth/decodeToken";

export default async ({ req }: {req: any }) => {
  try {
    if (!req) {
      return {authorized: false}
    }
    let payload = decodeToken(req.headers.authorization)
    return await getRepository(User).findOne(payload.user_id).then(user => {
      console.log(user)
      return {user, authorized: true}
    })

  } catch (err) {
    console.log(err)
    return {authorized: false}
  }
}