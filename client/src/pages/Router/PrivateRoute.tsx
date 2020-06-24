import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";
import routes from '../../constants/routes.json'
import AuthService from '../../auth';

// @ts-ignore
export default ({ component: Component, ...rest }) => {
  
  const token = AuthService.getToken();

  return (<Route {...rest} render={(props) => (
    token !== ''
      ? <Component {...props} />
      : <Redirect to={routes.LOGIN} />
  )} />)
}