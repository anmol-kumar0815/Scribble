import React, { useState, useEffect } from "react";

import { Typography, PageLoader } from "neetoui";

import organizationApi from "apis/admin/organization";

const Header = () => {
  const [loading, setLoading] = useState(true);
  const [organizationName, setOrganizationName] = useState("");

  const fetchOrganization = async () => {
    try {
      const {
        data: { organization },
      } = await organizationApi.list();
      setOrganizationName(organization.name);
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
      <div className="h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex h-12 w-full justify-center border-b-2 py-3">
      <Typography style="h4">{organizationName}</Typography>
    </div>
  );
};

export default Header;
