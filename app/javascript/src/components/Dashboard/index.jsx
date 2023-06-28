import React from "react";

import { Switch, Route } from "react-router-dom";

import Navbar from "common/Navbar";
import { DASHBOARD_ROUTES } from "components/routeConstants";

import Settings from "./Settings";

export const Dashboard = () => (
  <>
    <Navbar />
    <Switch>
      {DASHBOARD_ROUTES.map(({ path, component }) => (
        <Route exact component={component} key={path} path={path} />
      ))}
      <Route component={Settings} path="/settings" />
    </Switch>
  </>
);

export default Dashboard;
