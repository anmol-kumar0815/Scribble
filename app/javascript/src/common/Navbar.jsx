import React, { useEffect, useState } from "react";

import { ExternalLink, FileDownload } from "neetoicons";
import { PageLoader, Button, Typography } from "neetoui";
import { Header } from "neetoui/layouts";
import { NavLink, useLocation } from "react-router-dom";

import articlesApi from "apis/admin/articles";

const Navbar = () => {
  const [loading, setLoading] = useState(true);
  const [articleStatus, setArticleStatus] = useState("");

  const currentLocation = useLocation();
  const currentLocationPathValues = currentLocation.pathname.split("/");

  const fetchArticleDetails = async () => {
    const currentArticleId = currentLocationPathValues[2];
    try {
      const {
        data: { status },
      } = await articlesApi.show(currentArticleId);

      setArticleStatus(status);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const showStatusIfLocationIsArticleEditForm = () => {
    if (currentLocationPathValues[3] === "edit") {
      fetchArticleDetails();
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    showStatusIfLocationIsArticleEditForm();
  }, [currentLocation]);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <Header
        className="sticky top-0 z-20"
        actionBlock={
          <>
            {currentLocationPathValues[3] === "edit" && (
              <div
                className={`rounded-lg ${
                  articleStatus === "Published"
                    ? "neeto-ui-bg-success-500 text-white"
                    : "neeto-ui-bg-warning-500 text-white"
                }  px-2 py-1`}
              >
                {articleStatus === "Published" ? "Published" : "Draft"}
              </div>
            )}
            <Button
              className="mr-6"
              icon={ExternalLink}
              label="Preview"
              style="secondary"
              target="_blank"
              to="/public"
            />
          </>
        }
        title={
          <div className="flex px-6">
            <Typography style="h4">Scribble</Typography>
            <NavLink
              exact
              activeClassName="text-indigo-400 ml-6 text-base"
              className="ml-6 text-base text-gray-400"
              to="/"
            >
              Articles
            </NavLink>
            <NavLink
              activeClassName="text-indigo-400 ml-6 text-base"
              className="ml-6 text-base text-gray-400"
              to="/settings?tab=general"
            >
              Settings
            </NavLink>
            <NavLink
              activeClassName="text-indigo-400 ml-6 text-base"
              className="ml-6 text-base text-gray-400"
              to="/analytics"
            >
              Analytics
            </NavLink>
            <NavLink
              activeClassName="text-indigo-400 ml-6 text-base"
              className="ml-6 text-base text-gray-400"
              to="/articles/report"
            >
              <div className="flex items-center">
                <FileDownload />
                Download Report
              </div>
            </NavLink>
          </div>
        }
      />
      <hr />
    </>
  );
};
export default Navbar;
