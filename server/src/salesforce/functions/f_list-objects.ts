import { Connection, DescribeGlobalResult } from 'jsforce';
import SalesforceService from '../SalesforceService';

export interface SalesforceSObjectMeta {
  name: string;
  label: string;
}

// https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_calls_describesobjects_describesobjectresult.htm
export default async (connection: Connection): Promise<SalesforceSObjectMeta[]> => {
  return SalesforceService().ListObjects(connection).then(data => {
    console.log("LIST OBJECTS")
    console.log(JSON.stringify(data))
    console.log("./LIST OBJECTS")
    return data
  })
}