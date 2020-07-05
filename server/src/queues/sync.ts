import { PubSub } from "apollo-server";
import { SalesforceMeta } from "../entities/SalesforceMeta";
import { StreamManager, HStreamMessage } from "../salesforce/stream";
import { getRepository } from "typeorm";
import { StreamEvent } from "../entities/StreamEvent";
import { StreamEventFields } from "../entities/StreamEventFields";
import { TaskCondition } from "../entities/TaskCondition";
import { TaskEvent } from "../entities/TaskEvent";
import { TaskStatus } from "../entities/TaskStatus";
import logger from "../logger";
import { dateToKey } from "../util/date";

let dummyNumber = 0;

const updateTaskEvents = (event: StreamEvent): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!event.fields) {
        reject("no fields on event");
        return;
      }
      let taskEvents: TaskEvent[] = [];

      await Promise.all(event.fields.map(async (field) => {
        if (!field.value) {
          reject("no fields on event");
          return;
        }

        const conditions = await getRepository(TaskCondition).find({
          where: {
            organization_id: event.organization_id,
            object_type: event.object_type,
            field_name: field.name,
          },
        });

        conditions.map((condition) => {
          // todo:  I'd do switch/elif, but there may be overlap? idk
          if (condition.disqualifying_values?.includes(field.value!)) {
            // disqualified
            taskEvents.push({
              check_being_performed: "disqualify",
              status: "disqualified",
              last_modified_by_id: event.last_modified_by_id,
              last_modified_date: event.commit_timestamp,
              organization_id: event.organization_id,
              object_type: event.object_type,
              object_id: event.object_id,
              task_condition_associated: condition,
              value: field.value,
            });
          } else {
            taskEvents.push({
              check_being_performed: "disqualify",
              status: "neutral",
              last_modified_by_id: event.last_modified_by_id,
              last_modified_date: event.commit_timestamp,
              organization_id: event.organization_id,
              object_type: event.object_type,
              object_id: event.object_id,
              task_condition_associated: condition,
              value: field.value,
            });
          }

          if (condition.pre_target_values?.includes(field.value!)) {
            // pre-target met
            taskEvents.push({
              check_being_performed: "pre-target",
              status: "pre-target met",
              last_modified_by_id: event.last_modified_by_id,
              last_modified_date: event.commit_timestamp,
              organization_id: event.organization_id,
              object_type: event.object_type,
              object_id: event.object_id,
              task_condition_associated: condition,
              value: field.value,
            });
          } else {
            taskEvents.push({
              check_being_performed: "pre-target",
              status: "neutral",
              last_modified_by_id: event.last_modified_by_id,
              last_modified_date: event.commit_timestamp,
              organization_id: event.organization_id,
              object_type: event.object_type,
              object_id: event.object_id,
              task_condition_associated: condition,
              value: field.value,
            });
          }

          if (condition.target_values?.includes(field.value!)) {
            // target met
            taskEvents.push({
              check_being_performed: "target",
              status: "target hit",
              last_modified_by_id: event.last_modified_by_id,
              last_modified_date: event.commit_timestamp,
              organization_id: event.organization_id,
              object_type: event.object_type,
              object_id: event.object_id,
              task_condition_associated: condition,
              value: field.value,
            });
          } else {
            taskEvents.push({
              check_being_performed: "target",
              status: "neutral",
              last_modified_by_id: event.last_modified_by_id,
              last_modified_date: event.commit_timestamp,
              organization_id: event.organization_id,
              object_type: event.object_type,
              object_id: event.object_id,
              task_condition_associated: condition,
              value: field.value,
            });
          }
        });
      }));

      if (taskEvents.length > 0) {
        await getRepository(TaskEvent).save(taskEvents);
      }

      return resolve();
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
};

const updateProgresses = (organization_id: string, object_type: string, object_id: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      const events = await getRepository(TaskEvent).find({where: {
        object_id,
        object_type,
        organization_id
      }, order: {
        last_modified_date: "DESC",
        task_condition_associated: "DESC",
      }
    })

    let current_task_condition_id: string = '';

    let taskStatuses: Map<string, TaskStatus> = new Map<string, TaskStatus>();
    events.map(event => {
      let taskStatus: TaskStatus = {};
      if (current_task_condition_id.length === 0) {
        current_task_condition_id = event.task_condition_associated?.id!;
      } else if (current_task_condition_id !== event.task_condition_associated?.id) {
        // new task condition being processed. Store the last one, and set the current task condition id to the new one
        taskStatuses.set(current_task_condition_id, taskStatus);
        current_task_condition_id = event.task_condition_associated?.id!
        taskStatus.date_key = dateToKey(event.last_modified_date!);
      }

      if (event.check_being_performed === 'pre-target' && event.status === 'pre-target met') {
        console.log('pre-target disqualified for ' + current_task_condition_id);
      } else if (event.check_being_performed === 'disqualify' && event.status === '') {
        console.log('pre-target disqualified for ' + current_task_condition_id);
      }


    })

      resolve();
    } catch (err) {
      reject(err)
    }
  })
}

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
        fields: new Array<StreamEventFields>(),
        commit_timestamp: new Date(message.commit_timestamp),
      };

      message.fields.forEach((value: any, key: string) => {
        event.fields!.push({ name: key, value });
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
      })
      .then(async () => {
        await Promise.all(message.record_ids.map(async object_id => {
          await updateProgresses(message.organization_id, message.entity_name, object_id);
        }))
      })
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
          logger.info("published event");
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
