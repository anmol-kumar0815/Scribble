import React, { useState, useEffect } from "react";

import { Typography, PageLoader } from "neetoui";

import articlesApi from "apis/admin/articles";
import { allKeysToCamelCase } from "components/utils";

import ShowHistory from "./ShowHistory";

const VersionHistory = ({ article }) => {
  const [loading, setLoading] = useState(true);
  const [versions, setVersions] = useState([]);

  const fetchVersions = async () => {
    try {
      const {
        data: { versions },
      } = await articlesApi.versions(article.id);
      const skippedFirstVersion = versions.slice(0, -1);
      const camelCaseVersions = allKeysToCamelCase(skippedFirstVersion);
      setVersions(camelCaseVersions);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  if (loading) {
    return (
      <div className="h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <Typography style="h2">Version History</Typography>
      <Typography style="body2">Version history of {article.title}.</Typography>
      <ShowHistory article={article} versions={versions} />
    </>
  );
};

export default VersionHistory;
