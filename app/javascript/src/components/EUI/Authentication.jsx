import React, { useState, useEffect } from "react";

import { Formik, Form as FormikForm } from "formik";
import { Typography, Button } from "neetoui";
import { Input } from "neetoui/formik";

import organizationApi from "apis/admin/organization";
import { setAuthHeaders } from "apis/axios";
import AuthenticationImage from "images/AuthenticationImage";

import Header from "./Header";

const Authentication = () => {
  const [organizationName, setOrganizationName] = useState("");

  const handleSubmit = async values => {
    try {
      const response = await organizationApi.authenticate({
        password: values.password,
      });
      localStorage.setItem(
        "authToken",
        JSON.stringify(response.data.authentication_token)
      );
      setAuthHeaders();
      window.location.href = "/public";
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchOrganization = async () => {
    try {
      const {
        data: { organization },
      } = await organizationApi.list();
      setOrganizationName(organization.name);
    } catch (error) {
      logger.error(error);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, []);

  return (
    <>
      <Header />
      <div className="mx-auto mt-16 w-1/3">
        <img className="mx-auto w-1/3" src={AuthenticationImage} />
        <Typography className="mt-8" style="h2">
          {organizationName} is password protected!
        </Typography>
        <Typography style="body1">
          Enter the password to gain access to {organizationName}.
        </Typography>
        <Formik initialValues={{ password: "" }} onSubmit={handleSubmit}>
          <FormikForm className="mt-6">
            <Input required label="Password" name="password" type="password" />
            <Button className="mt-6" label="continue" type="submit" />
          </FormikForm>
        </Formik>
      </div>
    </>
  );
};
export default Authentication;
