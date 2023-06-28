import React, { useState, useEffect } from "react";

import { Plus, Search } from "neetoicons";
import { Typography } from "neetoui";
import { MenuBar } from "neetoui/layouts";
import { modify, evolve, append, filter } from "ramda";

import { STATUS_MENUBAR_LIST_ITEMS } from "./constants";
import Form from "./Form";

const SideBar = ({
  countByStatus,
  categories,
  fetchCategories,
  filtrationConstraints,
  setFiltrationConstraints,
}) => {
  const [isSearchCollapsed, setIsSearchCollapsed] = useState(true);
  const [isAddCategoryCollapsed, setIsAddCategoryCollapsed] = useState(true);
  const [searchedCategoryName, setSearchedCategoryName] = useState("");

  const filterCategoriesBySearchedName = () => {
    fetchCategories(searchedCategoryName);
  };

  const handleSelectedStatusChange = selectedStatus => {
    const getCurrentSatus = prevStatus =>
      prevStatus === selectedStatus ? "All" : selectedStatus;
    setFiltrationConstraints(
      modify("selectedStatus", prevStatus => getCurrentSatus(prevStatus))
    );
  };

  const selectCategory = selectedCategoryId => {
    setFiltrationConstraints(
      evolve({
        selectedCategoryIds: append(selectedCategoryId),
        page: () => 1,
      })
    );
  };

  const deselectCategory = selectedCategoryId => {
    setFiltrationConstraints(
      evolve({
        selectedCategoryIds: filter(
          categoryId => categoryId !== selectedCategoryId
        ),
        page: () => 1,
      })
    );
  };

  const handleSelectedCategoriesChange = selectedCategoryId => {
    setSearchedCategoryName("");
    setIsSearchCollapsed(true);
    if (
      filtrationConstraints.selectedCategoryIds.includes(selectedCategoryId)
    ) {
      deselectCategory(selectedCategoryId);
    } else {
      selectCategory(selectedCategoryId);
    }
  };

  const closeFormOnEscape = () => {
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        setSearchedCategoryName("");
        setIsSearchCollapsed(true);
        setIsAddCategoryCollapsed(true);
      }
    });
  };

  useEffect(() => {
    filterCategoriesBySearchedName();
  }, [searchedCategoryName]);

  useEffect(() => {
    closeFormOnEscape();
  }, []);

  return (
    <div className="flex w-3/12">
      <MenuBar showMenu="true" title="Articles">
        {STATUS_MENUBAR_LIST_ITEMS.map(item => (
          <MenuBar.Block
            active={filtrationConstraints.selectedStatus === item.label}
            count={countByStatus[item.id]}
            key={item.id}
            label={item.label}
            onClick={() => handleSelectedStatusChange(item.label)}
          />
        ))}
        <MenuBar.SubTitle
          iconProps={[
            {
              icon: Plus,
              onClick: () => {
                setIsAddCategoryCollapsed(
                  isAddCategoryCollapsed => !isAddCategoryCollapsed
                );
                setIsSearchCollapsed(true);
              },
            },
            {
              icon: Search,
              onClick: () => {
                setIsSearchCollapsed(isSearchCollapsed => !isSearchCollapsed);
                setSearchedCategoryName("");
                setIsAddCategoryCollapsed(true);
              },
            },
          ]}
        >
          <Typography
            component="h4"
            style="h5"
            textTransform="uppercase"
            weight="bold"
          >
            CATEGORIES
          </Typography>
        </MenuBar.SubTitle>
        <MenuBar.Search
          collapse={isSearchCollapsed}
          value={searchedCategoryName}
          onChange={e => setSearchedCategoryName(e.target.value)}
          onCollapse={() => {
            setIsSearchCollapsed(true);
            setSearchedCategoryName("");
          }}
        />
        {!isAddCategoryCollapsed && (
          <Form
            fetchCategories={fetchCategories}
            setIsAddCategoryCollapsed={setIsAddCategoryCollapsed}
          />
        )}
        {categories.map(category => (
          <MenuBar.Block
            count={category.count}
            key={category.id}
            label={category.name}
            active={filtrationConstraints.selectedCategoryIds.includes(
              category.id
            )}
            onClick={() => handleSelectedCategoriesChange(category.id)}
          />
        ))}
      </MenuBar>
    </div>
  );
};
export default SideBar;
