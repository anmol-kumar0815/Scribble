import React, { useState, useEffect } from "react";

import { PageLoader, Typography } from "neetoui";
import { Redirect } from "react-router-dom";

import articlesApi from "apis/public/articles";
import categoriesApi from "apis/public/categories";

import HeaderWithSearch from "./HeaderWithSearch";
import ShowArticle from "./ShowArticle";
import SidebarMenu from "./SidebarMenu";
import {
  findDefaultPath,
  findActiveArticleIndex,
  buildSearchOptions,
} from "./utils";

const Sidebar = () => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [activeSlug, setActiveSlug] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const [activeArticleCategoryIndex, setActiveArticleCategoryIndex] =
    useState(-1);

  const fetchCategories = async () => {
    try {
      const {
        data: { categories },
      } = await categoriesApi.list();

      setCategories(categories);
      findDefaultPath(categories, setActiveSlug, setActiveArticleCategoryIndex);
      findActiveArticleIndex(
        categories,
        setActiveArticleCategoryIndex,
        setActiveSlug
      );
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchArticles = async () => {
    try {
      const {
        data: { articles },
      } = await articlesApi.list();

      buildSearchOptions(articles, setSearchOptions);
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchCategoriesAndArticles = async () => {
    await Promise.all([fetchCategories(), fetchArticles()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategoriesAndArticles();
  }, []);

  useEffect(() => {
    findActiveArticleIndex(
      categories,
      setActiveArticleCategoryIndex,
      setActiveSlug
    );
  }, [activeSlug]);

  if (loading) {
    return (
      <div className="h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="w-full">
      <HeaderWithSearch
        searchOptions={searchOptions}
        setActiveSlug={setActiveSlug}
      />
      <div className="flex">
        <SidebarMenu
          activeArticleCategoryIndex={activeArticleCategoryIndex}
          categories={categories}
          setActiveArticleCategoryIndex={setActiveArticleCategoryIndex}
          setActiveSlug={setActiveSlug}
        />
        {activeArticleCategoryIndex === -1 ? (
          <Typography style="body1">
            Article not found: You might entered wrong url or this article is
            deleted by the admin.
          </Typography>
        ) : (
          <>
            <ShowArticle activeSlug={activeSlug} />
            <Redirect exact from="/public" to={`/public/${activeSlug}`} />
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
