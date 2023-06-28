import React, { useState, useEffect } from "react";

import { Table, PageLoader } from "neetoui";

import articlesApi from "apis/admin/articles";
import Pagination from "common/Pagination";
import { allKeysToCamelCase } from "components/utils";

import { articlesColumnData, articleVisitsColumnData } from "./utils";

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [totalArticlesCount, setTotalArticlesCount] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const fetchArticles = async () => {
    try {
      const {
        data: { articles, count },
      } = await articlesApi.published({ page: currentPageNumber });
      const camelCaseArticles = allKeysToCamelCase(articles);
      setArticles(camelCaseArticles);
      setTotalArticlesCount(count);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [currentPageNumber]);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="mx-64 mt-8">
      <Table
        allowRowClick={false}
        columnData={articlesColumnData}
        rowData={articles}
        expandable={{
          expandedRowRender: article => (
            <div className="m-0 w-64 pl-8">
              <Table
                allowRowClick={false}
                columnData={articleVisitsColumnData}
                rowData={article.visitsAlongDate}
              />
            </div>
          ),
        }}
      />
      <Pagination
        count={totalArticlesCount}
        currentPageNumber={currentPageNumber}
        pageSize="10"
        setCurrentPageNumber={setCurrentPageNumber}
      />
    </div>
  );
};

export default Analytics;
