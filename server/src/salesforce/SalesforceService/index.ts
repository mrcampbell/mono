import { ISalesforceService } from "../../app/services/salesforce";
import { TokenResponse, Connection, OAuth2, DescribeSObjectResult, Field, PicklistEntry, DescribeGlobalResult } from "jsforce";
import { SalesforceSObjectField, SalesforceSObjectPicklistEntry } from "../functions/f_describe-object";
import { SalesforceSObjectMeta } from "../functions/f_list-objects";
import config from "../../config";
const axios = require("axios").default;


let service: SalesforceService | undefined = undefined;

class SalesforceService implements ISalesforceService {
  RequestToken(code: string): Promise<TokenResponse> {
    return new Promise(async (resolve, reject) => {
      var oauth2 = new OAuth2({
        clientId: config.salesforce.clientID,
        clientSecret: config.salesforce.clientSecret,
        redirectUri: config.salesforce.callbackURI,
      });
      await oauth2.requestToken(code).then((token: TokenResponse) => {
        resolve(token);
      }).catch(reject);
    });
  }
  DescribeObject(connection: Connection, objectName: string): Promise<SalesforceSObjectField[]> {
    return new Promise(async (resolve, reject) => {
      await connection.describe(
        objectName)
        .then((res: DescribeSObjectResult ) => {
          const result: SalesforceSObjectField[] = [];
  
          console.log("Num of SObjects : " + res.fields.length);
          res.fields.forEach((f: Field) => {
            if (f.picklistValues != undefined && f.picklistValues?.length > 0) {
              let pl: SalesforceSObjectPicklistEntry[] = [];
              f.picklistValues.forEach((e: PicklistEntry) => {
                if (e.active && e.label && e.value) {
                  pl.push({ label: e.label, value: e.value });
                }
              });
  
              result.push({
                label: f.label,
                name: f.name,
                picklist_values: pl,
              });
            }
          });
  
          return resolve(result);
        }
      ).catch(reject);
    });
  }
   GetUser(accessToken: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      await axios
        .get("https://login.salesforce.com/services/oauth2/userinfo", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((res: any) => {
          return resolve(res.data);
        })
        .catch(reject);
    });
  }
  ListObjects(connection: Connection): Promise<SalesforceSObjectMeta[]> {
return new Promise(async (resolve, reject) => {
  await connection.describeGlobal().then((res: DescribeGlobalResult) => {
    const objs: SalesforceSObjectMeta[] = [];
    console.log('Num of SObjects : ' + res.sobjects.length);
    
    res.sobjects.forEach(obj => {
      if (
        !obj.deprecatedAndHidden &&
        obj.queryable &&  // todo: idk.  Look this up to be sure
        obj.triggerable  // todo: idk.  Look this up to be sure
        ) {
          objs.push({name: obj.name, label: obj.label})
        }
      })
      
      return resolve(objs)
    }).catch(reject)
})
  }
}

export default () => {
  if (!service) {
    service = new SalesforceService();
  }
  return service;
}