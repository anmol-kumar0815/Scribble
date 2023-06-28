import React, { useState, useEffect } from "react";

import { PageLoader } from "neetoui";
import { either, isNil, isEmpty } from "ramda";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import organizationApi from "apis/admin/organization";
import userApi from "apis/admin/user";
import { setAuthHeaders, registerIntercepts } from "apis/axios";
import PrivateRoute from "common/PrivateRoute";
// eslint-disable-next-line
import "lib/dayjs";

import Dashboard from "./components/Dashboard";
import Eui from "./components/EUI";
import Authentication from "./components/EUI/Authentication";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isAutenticated, setIsAutenticated] = useState(false);

  const authToken = JSON.parse(localStorage.getItem("authToken"));

  const fetchOrganization = async () => {
    setLoading(true);
    try {
      const {
        data: { organization },
      } = await organizationApi.list();
      setIsAutenticated(
        !organization.is_password_protected ||
          !either(isNil, isEmpty)(authToken)
      );
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const {
        data: { email },
      } = await userApi.currentUser();
      localStorage.setItem("userEmail", JSON.stringify(email));
    } catch (error) {
      logger.error(error);
    }
  };

  useEffect(() => {
    setAuthHeaders(setLoading);
    registerIntercepts();
    fetchCurrentUser();
    fetchOrganization();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ToastContainer />
        <Switch>
          <PrivateRoute
            component={() => <Authentication />}
            condition={!isAutenticated}
            path="/public/authentication"
            redirectRoute="/public"
          />
          <PrivateRoute
            component={() => <Eui />}
            condition={isAutenticated}
            path="/public"
            redirectRoute="/public/authentication"
          />
          <Route component={Dashboard} path="/" />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
