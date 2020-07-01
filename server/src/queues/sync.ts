import { PubSub } from "apollo-server";
import { SalesforceMeta } from "../entities/SalesforceMeta";
import { StreamManager, HStreamMessage } from "../salesforce/stream";
import { getRepository } from "typeorm";
import { StreamEvent } from "../entities/StreamEvent";
import { StreamEventFields } from "../entities/StreamEventFields";
import { TaskCondition } from "../entities/TaskCondition";
import { TaskEvent } from "../entities/TaskEvent";

let dummyNumber = 0;

const updateTaskEvents = (event: StreamEvent): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const conditions = await getRepository(TaskCondition).find({
        where: {
          organization_id: event.organization_id,
          object_type: event.object_type,
        },
      });

      const previousEvents = await getRepository(StreamEvent).find({
        where: {
          organization_id: event.organization_id,
          object_id: event.object_id,
        },
      });

      console.log(JSON.stringify(previousEvents));

      let fieldEvents = new Array<{
        field: string;
        value: string;
        timestamp: Date;
      }>();

      previousEvents.forEach((pe) => {
        console.log("PE: ", pe);
        pe.fields?.map((f) =>
          fieldEvents.push({
            field: f.field!,
            value: f.value!,
            timestamp: pe.commit_timestamp!,
          })
        );
      });

      let taskEvents: TaskEvent[] = [];

      conditions.map((condition) => {
        console.log(condition);
        if (
          condition.pre_target_values &&
          condition.pre_target_values.length !== 0
        ) {
          if (
            fieldEvents.filter((e) =>
              condition.pre_target_values!.includes(e.value)
            ).length === 0
          ) {
            console.log(
              "fail: pre-target values is not empty and pre-target value does not exist in field history"
            );
            taskEvents.push({
              last_modified_by_id: event.last_modified_by_id,
              last_modified_date_key: event.last_modified_date_key,
              object_id: event.object_id,
              object_type: event.object_type,
              organization_id: event.organization_id,
              status: 'pre-target not met',
              task_condition_associated: condition,
            });

            return;
          } else {
            console.log(
              "success: pre-target values is not empty and pre-target value exists in field history"
            );
          }
        } else {
          console.log("neutral: no pre-target values provided");
        }

        if (
          condition.disqualifying_values &&
          condition.disqualifying_values.length !== 0
        ) {
          if (
            fieldEvents.filter((e) =>
              condition.disqualifying_values!.includes(e.value)
            ).length === 0
          ) {
            console.log(
              "success: disqualifying values is not empty and disqualifying value does not exist in field history"
            );
          } else {
            console.log(
              "fail: disqualifying values is not empty and disqualifying value exists in field history"
            );
            taskEvents.push({
              last_modified_by_id: event.last_modified_by_id,
              last_modified_date_key: event.last_modified_date_key,
              object_id: event.object_id,
              object_type: event.object_type,
              organization_id: event.organization_id,
              status: 'disqualified',
              task_condition_associated: condition,
            });
            return;
          }
        } else {
          console.log("neutral: no disqualifying values");
        }

        if (condition.target_values && condition.target_values.length !== 0) {
          if (
            fieldEvents.filter((e) =>
              condition.target_values!.includes(e.value)
            ).length === 0
          ) {
            console.log(
              "neutral: target values is not empty and target value does not exist in field history"
            );
          } else {
            console.log(
              "completion: target values is not empty and target value exists in field history"
            );
            taskEvents.push({
              last_modified_by_id: event.last_modified_by_id,
              last_modified_date_key: event.last_modified_date_key,
              object_id: event.object_id,
              object_type: event.object_type,
              organization_id: event.organization_id,
              status: 'target hit',
              task_condition_associated: condition,
            });
          }
        }
      });

      if (taskEvents.length > 0) {
        await getRepository(TaskEvent).save(taskEvents)
      }

      return resolve();
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
};

export const handler = (message: HStreamMessage): Promise<void> => {
  console.log(message);
  let records = [] as StreamEvent[];
  try {
    message.record_ids.forEach(async (recordID) => {
      const event: StreamEvent = {
        change_type: message.change_type,
        last_modified_by_id: message.commit_user,
        object_id: recordID,
        object_type: message.entity_name,
        organization_id: message.organization_id,
        last_modified_date_key: "20190101",
        fields: new Array<StreamEventFields>(),
        commit_timestamp: new Date(message.commit_timestamp),
      };

      message.fields.forEach((value: any, field: string) => {
        event.fields!.push({ field, value });
      });

      records.push(event);
    });

    return getRepository(StreamEvent)
      .save(records)
      .then(async (res) => {
        console.log("saved new event!");
        console.log(res);
        await Promise.all(
          res.map(async (e) => {
            await updateTaskEvents(e);
          })
        );
        return Promise.resolve();
      });
  } catch (err) {
    console.log(err);
    return Promise.resolve();
  }
};

export default class SynchronousEventBus {
  private static progressPubSub: PubSub;
  private static streamManager: StreamManager = new StreamManager();

  public static async setup(progressPubSub: PubSub) {
    return new Promise(async (resolve, reject) => {
      this.progressPubSub = progressPubSub;

      await this.streamManager.LoadPreviousStreamClients(handler);

      // TODO: REMOVE DEBUG
      if (process.env.NODE_ENV !== "test") {
        setInterval(() => {
          this.progressPubSub.publish(`user_123`, {
            progresses: [
              {
                task_id: "123",
                date_key: "20200102",
                count: dummyNumber,
              },
            ],
          });
          console.log("published event");
          dummyNumber++;
        }, 3000);
      } // END REMOVE DEBUG

      return resolve();
    });
  }

  public static addStream(meta: SalesforceMeta) {
    this.streamManager.AddClient(meta, handler);
  }
}
