import { db } from "./db";
import { TaskCondition } from "../entities/TaskCondition";
import { rejects } from "assert";

export class TaskConditionRepository {

  static ListAllForOrg(organization_id: string): Promise<TaskCondition[]> {
    return db.getRepository(TaskCondition)
    .find({where:{organization_id}});
   }

   static ByID(organization_id: string, id:string): Promise<TaskCondition> {
    return db.getRepository(TaskCondition).findOneOrFail({where:{organization_id, id}});
   }

   static async CreateTaskCondition(tc: TaskCondition): Promise<TaskCondition> {
    return db
    .getRepository(TaskCondition)
    .save(tc);
   }
}