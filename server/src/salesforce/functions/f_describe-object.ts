import {
  Connection,
  DescribeSObjectResult,
  Field,
} from "jsforce";
import { PicklistEntry } from "jsforce";
import SalesforceService from "../SalesforceService";

export interface SalesforceSObjectPicklistEntry {
  value: string;
  label: string;
}

export interface SalesforceSObjectField {
  name: string;
  label: string;
  picklist_values: SalesforceSObjectPicklistEntry[];
}

// https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_calls_describesobjects_describesobjectresult.htm
// TODO: For now, only picklists.  In future, scalar operations will be supported, but MVP yo
export default async (
  connection: Connection,
  objectName: string
): Promise<SalesforceSObjectField[]> => {
  return SalesforceService().DescribeObject(connection, objectName).then(data => {
    console.log("DESCRIBE OBJ")
    console.log(JSON.stringify(data))
    console.log("./DESCRIBE OBJ")
    return data
  })
};
