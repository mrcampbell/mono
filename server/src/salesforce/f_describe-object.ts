import {
  Connection,
  DescribeSObjectResult,
  Field,
} from "jsforce";
import { PicklistEntry } from "jsforce/lib/api/metadata";

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
};
