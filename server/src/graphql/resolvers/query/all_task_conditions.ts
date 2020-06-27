import { TaskCondition } from "../../../entities/TaskCondition";
import { getRepository } from "typeorm";

export default async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  try {
    return getRepository(TaskCondition).find({where: {organization_id: context.user.organization_id}}).then((data: any) => {
      console.log("GOT" + data)
      return data
    }).catch(err => {
      console.log("Error yo")
      console.log(err)
    })
  } catch (err) {
    console.log(err)
  }
}