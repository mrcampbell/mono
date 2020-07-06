import { PubSub } from "apollo-server";
import { SalesforceMeta } from "../entities/SalesforceMeta";
import { StreamManager, HStreamMessage } from "../salesforce/stream";
import { getRepository } from "typeorm";
import { StreamEvent } from "../entities/StreamEvent";
import { StreamEventFields } from "../entities/StreamEventFields";
import { TaskCondition } from "../entities/TaskCondition";
import { TaskEvent } from "../entities/TaskEvent";
import { TaskStatus } from "../entities/TaskStatus";
// import logger from "../logger";
import { dateToKey } from "../util/date";

let dummyNumber = 0;


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
        // await Promise.all(
        //   res.map(async (e) => {
        //     await updateTaskEvents(e);
        //   })
        // );
        return Promise.resolve();
      })
      // .then(async () => {
      //   await Promise.all(message.record_ids.map(async object_id => {
      //     await updateProgresses(message.organization_id, message.entity_name, object_id);
      //   }))
      // })
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
          // logger.info("published event");
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
