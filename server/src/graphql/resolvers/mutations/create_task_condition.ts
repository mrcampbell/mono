import { TaskCondition } from "../../../entities/TaskCondition";
import { getRepository } from "typeorm";

export default async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  const { name, object_type, field_name, pre_target_values, target_values, disqualifying_values } = args.input;
  const tc: TaskCondition = {
    name,
    object_type,
    field_name, 
    pre_target_values,
    target_values,
    disqualifying_values,
    organization_id: context.user.organization_id,
  }
  try {

    return getRepository(TaskCondition).save(tc).then((data: any) => {
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