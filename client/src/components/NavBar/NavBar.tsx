import React from "react";
import { Link } from "react-router-dom";
import routes from "../../constants/routes.json";

export default () => {
  return (
    <div className="NavBar">
      <Link to={routes.HOME}>Home</Link>
      &nbsp;|&nbsp;
      <Link to={routes.PROGRESSES}>Progress</Link>
      &nbsp;|&nbsp;
      <Link to={routes.TASKS}>Tasks</Link>
      &nbsp;|&nbsp;
      <Link to={routes.LOGOUT}>Logout</Link>
    </div>
  );
};
