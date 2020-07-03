import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { QUERY_ALL_TASK_CONDITIONS } from "../../graphql/queries";

import { TaskCondition } from "../EditTaskCondition/EditTaskCondition";

export default () => {
  const { data, loading, error } = useQuery(QUERY_ALL_TASK_CONDITIONS);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    console.log(error);
    return <div>Error</div>;
  }

  const tableColumns = data.all_task_conditions.map((tc: TaskCondition) => {
    return (
      <tr>
        <td>{tc.name}</td>
        <td>{tc.object_type}</td>
        <td>{tc.field_name}</td>
      </tr>
    );
  });

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <table>
        {tableColumns}
      </table>
    </div>
  );
};
