import React, { useState, useEffect } from "react";

import { Typography, PageLoader } from "neetoui";

import organizationApi from "apis/admin/organization";

import Form from "./Form";

const General = () => {
  const [loading, setLoading] = useState(true);
  const [formInitialValues, setFormInitialValues] = useState({});

  const fetchOrganization = async () => {
    try {
      const {
        data: { organization },
      } = await organizationApi.list();
      setFormInitialValues({
        name: organization.name,
        isPasswordProtected: organization.is_password_protected,
      });
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    <div className="flex w-full justify-center">
      <div className="fixed ml-32 w-1/2 pl-32">
        <Typography className="mt-6" style="h2">
          General Settings
        </Typography>
        <Typography className="text-gray-600" style="body1">
          Configure general attributes of scribble.
        </Typography>
        <Form formInitialValues={formInitialValues} />
      </div>
    </div>
  );
};

export default General;
