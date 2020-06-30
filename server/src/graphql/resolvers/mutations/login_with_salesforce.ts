import f_getUser from "../../../salesforce/functions/f_get-user";
import { TokenResponse } from "jsforce";
import f_authenticate from "../../../salesforce/functions/f_authenticate";
import { User } from "../../../entities/User";
import { signToken } from "../../../auth/signToken";
import { getRepository } from "typeorm";
import { AuthenticationError } from "apollo-server";

export default async (parent: any, args: any, context: any, info: any) => {

  // DEBUG
  if (args.code === "admin") {
    let token = signToken({
      user_id: `salesforce|0056g000002hQheAAE`,
    });
    return {
      access_token: token,
      user_email: 'fake@email.com',
    };
  }
  // ./DEBUG

  return await f_authenticate(args.code)
    .then(async (res: TokenResponse) => {
      console.log(res);
      const user: any = await f_getUser(res.access_token);
      console.log(user);
      const {
        user_id,
        organization_id,
        preferred_username,
        name,
        photos,
        user_type,
        profile,
      } = user as any;
      console.log({
        user_id,
        organization_id,
        preferred_username,
        name,
        photos,
        user_type,
        profile,
      });

      let hubbie_user_id = `salesforce|${user_id}`
      const entity: User = {
        id: hubbie_user_id,
        name,
        organization_id,
        salesforce_profile_picture: photos.picture,
        salesforce_thumbnail_picture: photos.thumbnail,
        salesforce_user_id: user_id,
        salesforce_username: preferred_username,
        last_logged_in_at: new Date(),
        salesforce_meta: {
          id: `salesforce|${organization_id}`,
          access_token: res.access_token,
          refresh_token: res.refresh_token,
          organization_id: organization_id,
          stream_is_live: false,
          instance_url: user.instance_url,
          issued_at: Math.round(new Date().getTime() / 1000),
        },
      };

      await getRepository(User)
        .save(entity)
        .catch((err) => {
          console.log(err);
        });

      let token = signToken({
        user_id: hubbie_user_id,
      });

      return {
        access_token: token,
        user_email: preferred_username,
      };
    })
    .catch((err) => {
      console.log(err);
      return new AuthenticationError("code invalid");
    });
};
