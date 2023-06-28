import React, { useState, useEffect } from "react";

import { PageLoader } from "neetoui";
import { modify } from "ramda";

import articlesApi from "apis/admin/articles";
import categoriesApi from "apis/admin/categories";
import { allKeysToCamelCase } from "components/utils";

import ActionBlock from "./ActionBlock";
import {
  displayColumnData,
  countInitialValues,
  filtrationConstraintsData,
} from "./constants";
import SideBar from "./SideBar";
import Table from "./Table";

const Articles = () => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [displayColumn, setDisplayColumn] = useState(displayColumnData);
  const [countByStatus, setCountByStatus] = useState(countInitialValues);
  const [totalArticlesCount, setTotalArticlesCount] = useState(0);
  const [filtrationConstraints, setFiltrationConstraints] = useState(
    filtrationConstraintsData
  );

  const handleDisplayColumn = column => {
    setDisplayColumn(modify(column, prevValue => !prevValue));
  };

  const fetchCategories = async (searchedName = "") => {
    try {
      const {
        data: { categories },
      } = await categoriesApi.list({ searchedName });
      setCategories(categories);
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchStatusCounts = async () => {
    try {
      const { data } = await articlesApi.statusCounts({
        selectedCategoryIds: filtrationConstraints.selectedCategoryIds,
      });
      setCountByStatus(data);
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchArticles = async () => {
    try {
      const {
        data: { articles, count },
      } = await articlesApi.list(filtrationConstraints);
      const camelCaseArticles = allKeysToCamelCase(articles);
      setArticles(camelCaseArticles);
      setTotalArticlesCount(count);
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchArticlesCategoriesAndStatusCount = async () => {
    await Promise.all([
      fetchArticles(),
      fetchCategories(),
      fetchStatusCounts(),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticlesCategoriesAndStatusCount();
  }, [filtrationConstraints]);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <SideBar
        categories={categories}
        countByStatus={countByStatus}
        fetchCategories={fetchCategories}
        filtrationConstraints={filtrationConstraints}
        setFiltrationConstraints={setFiltrationConstraints}
      />
      <div className="w-9/12 py-6 pl-4 pr-6">
        <ActionBlock
          articles={articles}
          categories={categories}
          displayColumn={displayColumn}
          filtrationConstraints={filtrationConstraints}
          handleDisplayColumn={handleDisplayColumn}
          setFiltrationConstraints={setFiltrationConstraints}
        />
        <Table
          articles={articles}
          displayColumn={displayColumn}
          filtrationConstraints={filtrationConstraints}
          setFiltrationConstraints={setFiltrationConstraints}
          totalArticlesCount={totalArticlesCount}
          fetchArticlesCategoriesAndStatusCount={
            fetchArticlesCategoriesAndStatusCount
          }
        />
      </div>
    </div>
  );
};
export default Articles;
