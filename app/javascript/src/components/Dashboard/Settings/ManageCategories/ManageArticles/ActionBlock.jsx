import React, { useState } from "react";

import { Typography, Select, Alert } from "neetoui";

import articlesApi from "apis/admin/articles";
import TooltipWrapper from "common/TooltipWrapper";

import Delete from "./Delete";
import OrderBy from "./OrderBy";

import { categoriesExceptSelectedCategory, getCurrentOrderBy } from "../utils";

const ActionBlock = ({
  activeCategory,
  categories,
  selectedArticleIds,
  refetch,
}) => {
  const [showMoveArticlesModal, setShowMoveArticlesModal] = useState(false);
  const [moveToCategory, setMoveToCategory] = useState({});

  const handleMoveArticles = categoryId => {
    if (categoryId === null) return;

    setShowMoveArticlesModal(true);
    setMoveToCategory(categoryId);
  };

  const handleMoveArticlesToSelectedCategory = async () => {
    setShowMoveArticlesModal(false);
    try {
      await articlesApi.move({
        article_ids_that_need_to_be_move: selectedArticleIds,
        move_into_category_id: moveToCategory.value,
      });
      refetch();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <>
      <Typography style="h5">Manage Articles</Typography>
      <div className="flex w-full place-items-end justify-between">
        <Delete refetch={refetch} selectedArticleIds={selectedArticleIds} />
        <OrderBy activeCategory={activeCategory} refetch={refetch} />
        <div className="w-4/12">
          <TooltipWrapper
            position="bottom"
            content={
              categories.length === 1
                ? "Add category to move article into it."
                : "Select article to move it in another category."
            }
            disabled={
              selectedArticleIds.length === 0 || categories.length === 1
            }
          >
            <Select
              isClearable
              isSearchable
              label="Move to"
              name="category"
              placeholder="Search category name"
              isDisabled={
                selectedArticleIds.length === 0 || categories.length === 1
              }
              options={categoriesExceptSelectedCategory(
                categories,
                activeCategory
              )}
              onChange={categoryId => handleMoveArticles(categoryId)}
            />
          </TooltipWrapper>
        </div>
      </div>
      {activeCategory.orderArticlesBy !== "none" &&
        activeCategory.articles.length > 0 && (
          <Typography
            className="neeto-ui-bg-primary-100 mt-2 text-center"
            style="body3"
          >
            Articles are ordered by: &nbsp;
            {getCurrentOrderBy(activeCategory.orderArticlesBy)}
          </Typography>
        )}
      <Alert
        isOpen={showMoveArticlesModal}
        title={`Move ${selectedArticleIds.length} ${
          selectedArticleIds.length > 1 ? "articles" : "article"
        } from ${activeCategory.name} category to ${
          moveToCategory.label
        } category ?`}
        onClose={() => setShowMoveArticlesModal(false)}
        onSubmit={() => handleMoveArticlesToSelectedCategory()}
      />
    </>
  );
};

export default ActionBlock;
