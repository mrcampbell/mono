import { Connection, DescribeGlobalResult } from 'jsforce';

export interface SalesforceSObjectMeta {
  name: string;
  label: string;
}

// https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_calls_describesobjects_describesobjectresult.htm
export default async (connection: Connection): Promise<SalesforceSObjectMeta[]> => {
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