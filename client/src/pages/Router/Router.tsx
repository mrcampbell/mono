import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
} from "react-router-dom";
import React, { useEffect, useState } from "react";
import PrivateRoute from './PrivateRoute';

import NavBar from "../../components/NavBar/NavBar";

import Login from "../Login/Login";
import Logout from "../Logout/Logout";
import Progresses from "../Progresses/Progresses";
import Tasks from "../Tasks/Tasks";
import Home from "../Home/Home";
import LoginSalesforceSuccess from "../LoginSalesforceSuccess/LoginSalesforceSuccess";
import config from "../../config";
import routes from "../../constants/routes.json";
import AuthService from "../../auth";

export default () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  useEffect(() => {
    const hasToken = AuthService.hasToken()
    setIsLoggedIn(hasToken)
  }, [])

  return (
    <Router>
      {
        isLoggedIn && 
        <NavBar />
      }
      <Switch>
        <Route path={routes.LOGIN} exact>
          <Login />
        </Route>

        <Route path={config.salesforce.login_redirect_path}>
          <LoginSalesforceSuccess />
        </Route>

        <Route path={routes.LOGOUT} exact>
          <Logout />
        </Route>
        <PrivateRoute path={routes.PROGRESSES} component={Progresses} />
        <PrivateRoute path={routes.TASKS} component={Tasks} />
        <PrivateRoute path={routes.HOME} component={Home} />
      </Switch>
    </Router>
  );
};
