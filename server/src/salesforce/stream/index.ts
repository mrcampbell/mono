import { Connection, StreamingMessage } from 'jsforce';
import { SalesforceMeta } from '../../entities/SalesforceMeta';
import config from '../../config';
import { getRepository } from 'typeorm';

const STREAM_OBJECTS = ['Opportunity', 'Lead']

export type StreamMessageHandler = (sm: HStreamMessage) => Promise<void>

export interface HStreamMessage {
  fields: Map<string, any>;
  record_ids: string[];
  change_type: string;
  entity_name: string;
  replay_id: number;
  raw: any;
  organization_id: string;
  commit_user: string;
}

class StreamClient {
  connection: Connection

  constructor(
   private meta: SalesforceMeta,
   private messageHandler: StreamMessageHandler,
  ) {
    this.connection = new Connection({
      instanceUrl: meta.instance_url,
      accessToken: meta.access_token,
      refreshToken: meta.refresh_token,
      oauth2: {
        clientId: config.salesforce.clientID,
        clientSecret: config.salesforce.clientSecret,
      }
    })
   }

   async Subscribe(topics: string[]): Promise<boolean> {
    topics.forEach(async t => {
      const channel = `/data/${t}ChangeEvent`
      await this.Ping()
      console.log('added ' + channel )
      this.connection.streaming.topic(channel).subscribe(async (message: any) => {
        console.log(JSON.stringify(message, null, 2))
        try {
          const payload = {
            fields: new Map<string, any>(),
          } as HStreamMessage;
          payload.raw = JSON.stringify(message)
          payload.entity_name = message.payload.ChangeEventHeader.entityName
          payload.change_type = message.payload.ChangeEventHeader.changeType
          payload.record_ids = message.payload.ChangeEventHeader.recordIds
          payload.commit_user = message.payload.ChangeEventHeader.commitUser;
          payload.organization_id = this.meta.organization_id!;
          
          message.payload.ChangeEventHeader.changedFields.forEach((cf: string) => {
            payload.fields.set(cf, message.payload[cf])
          })

          payload.replay_id = message.event.replayId

          this.messageHandler(payload)
        } catch (err) {
          console.log(err)
        }
      })
    })

    return Promise.resolve(true)
   }

   Ping(): Promise<string> {
     console.log('pinging')
    return this.connection.query('Select Id from Opportunity LIMIT 1').then(
      (success) => Promise.resolve('Successfully checked org ' + this.meta.organization_id + ' | ' + JSON.stringify(success)),
      (err) => Promise.reject(`failed to ping org ${this.meta.organization_id}. err: ${err}`)
    )
   }
}

export class StreamManager {
  private clients: Map<string, StreamClient>;

  constructor() {
    this.clients = new Map<string, StreamClient>();
  }

  async LoadPreviousStreamClients(handler: StreamMessageHandler) {
    await getRepository(SalesforceMeta).find().then(async (metas: SalesforceMeta[]) => {
      console.log("RELOADING")
      metas.forEach(async (m) => {
        await this.AddClient(m, handler);
      })
    })
  }

  async AddClient(meta: SalesforceMeta, handler: StreamMessageHandler) {
    const client = new StreamClient(meta, handler);
    await client.Subscribe(STREAM_OBJECTS)
    this.clients.set(meta.organization_id!, client)
  }

  HealthCheck(organization_id: string): Promise<any> {
    const client = this.clients.get(organization_id)
    if (!client) {
      return Promise.reject("no client with organization id: " + organization_id)
    }
    return client.Ping()
  }
}
