import React, { useState, useEffect } from "react";

import { Plus, MenuVertical } from "neetoicons";
import { PageLoader, Button, Typography } from "neetoui";
import { MenuBar } from "neetoui/layouts";
import { equals, mergeLeft } from "ramda";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { allKeysToCamelCase } from "src/components/utils";

import categoriesApi from "apis/admin/categories";

import ManageArticles from "./ManageArticles";
import MenuBarItem from "./MenuBarItem";
import Pane from "./Pane";

const ManageCategories = () => {
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const rearrange = (categories, startIndex, endIndex) => {
    const shuffledCategories = Array.from(categories);

    const [removed] = shuffledCategories.splice(startIndex, 1);
    shuffledCategories.splice(endIndex, 0, removed);

    return shuffledCategories;
  };

  const reorderCategoriesForFrontend = position => {
    const reorderedCategories = rearrange(
      categories,
      position.source.index,
      position.destination.index
    );
    setCategories(reorderedCategories);
  };

  const handleOnDragEnd = async position => {
    if (!position.destination) return;

    reorderCategoriesForFrontend(position);
    try {
      const id = position.draggableId;
      const destination = position.destination.index;

      await categoriesApi.reorder(id, { destination: destination + 1 });
      fetchCategories();
    } catch (error) {
      logger.error(error);
    }
  };

  const updateActiveCategoryArticles = updatedCategories => {
    let found = false;
    updatedCategories.forEach(category => {
      if (equals(category.id, activeCategory.id)) {
        found = true;
        setActiveCategory(mergeLeft(category, activeCategory));

        return;
      }

      if (!found) {
        setActiveCategory(updatedCategories[0]);
      }
    });
  };

  const fetchCategories = async (searchedName = "") => {
    try {
      const {
        data: { categories },
      } = await categoriesApi.list({ searchedName });
      const camelCaseCategories = allKeysToCamelCase(categories);
      setCategories(camelCaseCategories);

      if (camelCaseCategories.length > 0) {
        activeCategory === null
          ? setActiveCategory(camelCaseCategories[0])
          : updateActiveCategoryArticles(camelCaseCategories);
      } else {
        setActiveCategory(null);
      }
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="absolute right-0 flex w-3/4">
      <MenuBar showMenu className="fixed w-1/4 overscroll-y-auto">
        <div className="flex justify-between">
          <Typography style="h4">Manage Categories</Typography>
          <Button
            icon={Plus}
            size={10}
            onClick={() => setShowAddCategory(prevValue => !prevValue)}
          />
        </div>
        {showAddCategory && (
          <Pane
            refetch={fetchCategories}
            setShowAddCategory={setShowAddCategory}
          />
        )}
        {activeCategory ? (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="categories">
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {categories.map((category, index) => (
                    <MenuBarItem
                      activeCategory={activeCategory}
                      categories={categories}
                      category={category}
                      icon={MenuVertical}
                      id={category.id}
                      index={index}
                      key={category.id}
                      refetch={fetchCategories}
                      setActiveCategory={setActiveCategory}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <Typography>
            Looks like you don't have any categories. Create a new category.
          </Typography>
        )}
      </MenuBar>
      {activeCategory && (
        <ManageArticles
          activeCategory={activeCategory}
          categories={categories}
          refetch={fetchCategories}
          setActiveCategory={setActiveCategory}
        />
      )}
    </div>
  );
};

export default ManageCategories;
