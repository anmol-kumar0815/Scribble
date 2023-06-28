import React, { useState, useEffect } from "react";

import { Search, Keyboard } from "neetoicons";
import { Typography, PageLoader } from "neetoui";

import organizationApi from "apis/admin/organization";

import SearchModal from "./SearchModal";

const HeaderWithSearch = ({ searchOptions, setActiveSlug }) => {
  const [loading, setLoading] = useState(true);
  const [organizationName, setOrganizationName] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);

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

  const OpenSearchModalOnPressCommandKAndCloseOnEscape = () => {
    document.addEventListener("keydown", e => {
      if (e.metaKey && e.key === "k") {
        setShowSearchModal(true);
      } else if (e.key === "Escape") {
        setShowSearchModal(false);
      }
    });
  };

  useEffect(() => {
    fetchOrganization();
    OpenSearchModalOnPressCommandKAndCloseOnEscape();
  }, []);

  if (loading) {
    return (
      <div className="h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex h-12 w-full border-b-2">
      <div
        className="border h-4/5 my-2 ml-2 w-1/4 px-2 py-1"
        onClick={() => setShowSearchModal(true)}
      >
        <Search className="float-left" color="#C2C8CC" size={20} />
        <Typography className="float-left text-gray-400" style="body2">
          Search for articles here
        </Typography>
        <Typography className="float-right text-gray-400" style="body2">
          K
        </Typography>
        <Keyboard className="float-right mt-1" color="#C2C8CC" size={12} />
      </div>
      <div className="w-full">
        <Typography className="mt-3 flex justify-center" style="h4">
          {organizationName}
        </Typography>
      </div>
      <SearchModal
        searchOptions={searchOptions}
        setActiveSlug={setActiveSlug}
        setShowSearchModal={setShowSearchModal}
        showSearchModal={showSearchModal}
      />
    </div>
  );
};

export default HeaderWithSearch;
