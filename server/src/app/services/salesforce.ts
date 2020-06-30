import { TokenResponse, Connection } from "jsforce";
import { SalesforceSObjectField } from "../../salesforce/functions/f_describe-object";
import { SalesforceSObjectMeta } from "../../salesforce/functions/f_list-objects";

export interface ISalesforceService {
  RequestToken(code: string): Promise<TokenResponse>
  DescribeObject(connection: Connection, objectName: String): Promise<SalesforceSObjectField[]>
  GetUser(accessToken: string): Promise<any> // todo: type
  ListObjects(connection: Connection): Promise<SalesforceSObjectMeta[]>
}