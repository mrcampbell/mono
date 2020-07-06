import { TaskCondition } from "../../../entities/TaskCondition";
import { getRepository } from "typeorm";
import { TaskConditionStage } from "../../../entities/TaskConditionStages";

export default async (
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  const { name, object_type, field_name, stages } = args.input;

  const tc: TaskCondition = {
    name,
    object_type,
    field_name, 
    organization_id: context.user?.organization_id || "test",
    // stages,
  }

  console.log(tc)
  try {

    let savedStages = await getRepository(TaskConditionStage).save(stages)
    tc.stages = savedStages;

    return getRepository(TaskCondition).save(tc).then((data: any) => {
      return data
    }).catch(err => {
      console.log("Error yo")
      console.log(err)
    })
  } catch (err) {
    console.log(err)
  }
}