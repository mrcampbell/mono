import React, { useEffect } from "react";
import AuthService from '../../auth'
import { Redirect } from "react-router-dom";
import routes from '../../constants/routes.json'

export default () => {

  useEffect(() => {
    console.log('clearing token')
    AuthService.clearToken();
  }, [])

  return (
    <Redirect to={routes.LOGIN} />
  );
};
