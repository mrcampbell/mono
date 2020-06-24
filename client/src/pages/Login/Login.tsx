import React, { useEffect } from "react";

import { useQuery } from "@apollo/react-hooks";
import { QUERY_SALESFORCE_AUTH_CALLBACK_URI } from "../../graphql/queries";
import AuthService from "../../auth";
import { useHistory } from "react-router-dom";

export default () => {
  const { loading, data, error } = useQuery(QUERY_SALESFORCE_AUTH_CALLBACK_URI);
  const { push } = useHistory();

  if (AuthService.hasToken()) {
    push("/");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="LoginContainer">
      <a href={data.salesforce_auth_callback_uri}>
        <button>Login with Salesforce</button>
      </a>
    </div>
  );
};
