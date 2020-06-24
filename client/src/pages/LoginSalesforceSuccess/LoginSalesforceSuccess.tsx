import React, { useEffect } from "react";

import { useMutation } from "@apollo/react-hooks";
import { MUTATION_LOGIN_WITH_SALESFORCE } from "../../graphql/queries";
import { useLocation, Redirect } from "react-router-dom";
import AuthService from '../../auth'
import routes from '../../constants/routes.json'


export default () => {
  const location = useLocation();

  const [login, { data, error, loading }] = useMutation(
    MUTATION_LOGIN_WITH_SALESFORCE,
    {onError: (err) => {
      console.log(err)
    }}
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code')
    console.log(code);
    if (!code) {
      console.log('no code provided')
    } 

    login({variables: {code}})
    .then(response => {
      if (!response) {
        return;
      }
      console.log(response)
      if (response.errors) {
        console.log(response.errors) // todo: handle
        return
      }

      const token = response.data.login_with_salesforce

      if (token && token.access_token) {
        AuthService.saveToken(token.access_token)
      }
    })

  }, [location, login]);



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{JSON.stringify(error, null, 2)}</div>;
  }
  console.log(data);

  return (
    <Redirect to={routes.HOME}/>
  );
};
