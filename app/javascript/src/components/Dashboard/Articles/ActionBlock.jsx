import React from "react";

import { Search, Down } from "neetoicons";
import { Button, Input, Dropdown, Checkbox } from "neetoui";
import { evolve } from "ramda";

import TooltipWrapper from "common/TooltipWrapper";

import { COLUMN_DROPDOWN_MENU_ITEMS } from "./constants";

const { Menu, MenuItem } = Dropdown;

const ActionBlock = ({
  displayColumn,
  handleDisplayColumn,
  categories,
  articles,
  filtrationConstraints,
  setFiltrationConstraints,
}) => (
  <div className="flex gap-x-3">
    <Input
      className="ml-64"
      placeholder="Search article title"
      prefix={<Search />}
      value={filtrationConstraints.searchedTitle}
      onChange={e =>
        setFiltrationConstraints(
          evolve({
            searchedTitle: () => e.target.value,
            page: () => 1,
          })
        )
      }
    />
    <Dropdown buttonStyle="secondary" icon={Down} label="Columns">
      <Menu>
        {COLUMN_DROPDOWN_MENU_ITEMS.map(Item => (
          <MenuItem.Button key={Item.id}>
            <Checkbox
              checked={displayColumn[Item.id]}
              id={Item.id}
              label={Item.label}
              onChange={e => handleDisplayColumn(e.target.id)}
            />
          </MenuItem.Button>
        ))}
      </Menu>
    </Dropdown>
    <TooltipWrapper
      content="Add category to proceed"
      disabled={categories.length === 0 && articles.length === 0}
      position="bottom"
    >
      <Button
        disabled={categories.length === 0 && articles.length === 0}
        label="Add new article"
        style="primary"
        to={categories.length === 0 ? "/" : "/article/create"}
      />
    </TooltipWrapper>
  </div>
);

export default ActionBlock;
