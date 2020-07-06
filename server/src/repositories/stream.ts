// import { SalesforceMeta } from "../entities/SalesforceMeta";
// import { StreamClientMeta } from "../../worker/stream";
// import { db } from "./db";

// // todo: generify to cover all auth.  Store in Okta/Auth0 or something
// export class StreamClientRepository {

//   static SalesforceCredsByOrgID(OrganizationID: string): Promise<SalesforceMeta | undefined> {
//     return db.getRepository(SalesforceMeta)
//     .findOne({OrganizationID})
//     .then((data) => {
//       console.log(data)
//       return Promise.resolve(data)
//     }).catch(err => {
//       console.error(err)
//       return Promise.reject(err)
//     })
//    }

//    static UpdateLastTransmission(orgID: string): Promise<boolean> {
//     return db
//     .getRepository(SalesforceMeta)
//     .createQueryBuilder()
//     .update()
//     .set({LastTransmission: new Date()})
//     .where("OrganizationID = :orgID", { orgID })
//     .execute()
//     .then(() => {
//       console.log('updated last transmission for ' + orgID);
//       return true
//     })
//     .catch(err => {
//       console.error(err)
//       return false
//     })
//    }

//    static ListAllStreamClients(): Promise<SalesforceMeta[]> {
//     return db.getRepository(SalesforceMeta).find().then(clients => {
//       console.log(`listed all stream clients.  (count: ${clients.length}`)
//       return clients
//     }).catch(err => {
//       console.error(err);
//       return err
//     })
//    }

//    static UpdateLastHealthCheck(orgID: string): Promise<boolean> {
//     return db
//     .getRepository(SalesforceMeta)
//     .createQueryBuilder()
//     .update()
//     .set({LastHealthCheck: new Date()})
//     .where("OrganizationID = :orgID", { orgID })
//     .execute().then(() => {
//       console.log('updated last healthcheck for ' + orgID);
//       return true
//     }).catch(err => {
//       console.error(err)
//       return false
//     })
//    }

//    static SaveStreamClientMeta(meta: StreamClientMeta): Promise<boolean> {
//     return db.getRepository(SalesforceMeta).save({
//       OrganizationID: meta.orgID,
//       AccessToken: meta.accessToken,
//       RefreshToken: meta.refreshToken,
//       InstanceURL: meta.instanceUrl,
//       IssuedAt: meta.authIssuedAt, 
//       LastHealthCheck: undefined,
//       LastTransmission: undefined,
//       isLive: true,
//       InitializedAt: new Date(),
//       StreamIsLive: true,
//     } as SalesforceMeta).then(() => {
//       console.log('created stream meta for ' + meta.orgID);
//       return true
//     }).catch(err => {
//       console.error(err)
//       return false
//     })
//    }

// }