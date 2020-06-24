import React, { useEffect } from "react";
import "./App.css";
import Router from "../Router/Router";
import { useStore, setUserLoggedIn } from "../../store";
import AuthService from "../../auth";

function App() {
  return (
    <div className="App">
      <Router />
    </div>
  );
}

export default App;
