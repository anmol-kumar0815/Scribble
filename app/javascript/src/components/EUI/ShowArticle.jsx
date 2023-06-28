import React, { useState, useEffect } from "react";

import { Typography, PageLoader } from "neetoui";

import visitsApi from "apis/admin/visits";
import articlesApi from "apis/public/articles";

import { formatDateToMonthDayYear, getCurrentDate } from "./utils";

const ShowArticle = ({ activeSlug }) => {
  const [loading, setLoading] = useState(true);
  const [article, setArticle] = useState({});

  const fetchArticle = async () => {
    try {
      const {
        data: { title, body, updated_at, category },
      } = await articlesApi.show(activeSlug);
      const article = {
        title,
        body: body.split("\n"),
        updatedAt: updated_at,
        category,
      };
      setArticle(article);
    } catch (error) {
      logger.error(error);
    }
  };

  const updateVisitCount = async () => {
    try {
      const date = getCurrentDate();
      await visitsApi.update(activeSlug, { date });
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchArticleAndUpdateVisitCount = async () => {
    await Promise.all([fetchArticle(), updateVisitCount()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticleAndUpdateVisitCount();
  }, [activeSlug]);

  if (loading) {
    return (
      <div className="h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="m-8 w-3/4">
      <Typography style="h1">{article.title}</Typography>
      <div className="mt-2 flex">
        <Typography
          className="neeto-ui-rounded neeto-ui-bg-primary-100 neeto-ui-text-primary-800 mr-4 py-1 px-3"
          style="h5"
        >
          {article.category.name}
        </Typography>
        <Typography className="neeto-ui-text-gray-400 p-1" style="h5">
          {formatDateToMonthDayYear(article.updatedAt)}
        </Typography>
      </div>
      <div className="mt-6">
        {article.body.map((paragraph, index) => (
          <Typography key={index} style="body2">
            {paragraph}
            <br />
          </Typography>
        ))}
      </div>
    </div>
  );
};

export default ShowArticle;
