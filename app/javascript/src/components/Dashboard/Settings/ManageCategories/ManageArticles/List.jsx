import React from "react";

import { assoc } from "ramda";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import articlesApi from "apis/admin/articles";
import useUpdateCategory from "hooks/reactQuery/categories/useUpdate";

import Show from "./Show";

const List = ({
  activeCategory,
  setSelectedArticleIds,
  setActiveCategory,
  refetch,
}) => {
  const { mutate: updateCategory } = useUpdateCategory({
    onSuccess: () => null,
    onError: error => logger.error(error),
  });

  const rearrange = (activeCategory, startIndex, endIndex) => {
    const shuffledArticles = Array.from(activeCategory.articles);

    const [removed] = shuffledArticles.splice(startIndex, 1);
    shuffledArticles.splice(endIndex, 0, removed);
    const updatedActiveCategory = assoc(
      "articles",
      shuffledArticles,
      activeCategory
    );

    return updatedActiveCategory;
  };

  const reorderArticlesForFrontend = position => {
    const updatedActiveCategory = rearrange(
      activeCategory,
      position.source.index,
      position.destination.index
    );
    setActiveCategory(updatedActiveCategory);
  };

  const handleOnDragEnd = async position => {
    if (!position.destination) return;
    reorderArticlesForFrontend(position);
    const updatedOrderBy = {
      id: activeCategory.id,
      payload: { order_articles_by: "none" },
    };
    updateCategory(updatedOrderBy);
    try {
      const id = position.draggableId;
      const destination = position.destination.index;

      await articlesApi.reorder(id, {
        destination: destination + 1,
      });
      refetch();
    } catch (error) {
      logger.error(error);
    }
  };

  if (activeCategory.articles.length === 0) {
    return <div>No Article found in this category.</div>;
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="articles">
        {provided => (
          <div
            {...provided.droppableProps}
            className="mb-12"
            ref={provided.innerRef}
          >
            {activeCategory.articles.map((article, index) => (
              <Show
                activeCategory={activeCategory}
                article={article}
                index={index}
                key={article.id}
                setSelectedArticleIds={setSelectedArticleIds}
              />
            ))}
            {provided.placeholder}
            <br />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default List;
