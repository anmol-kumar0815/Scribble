import React, { useState } from "react";

import { MenuVertical } from "neetoicons";
import { Typography, Dropdown } from "neetoui";
import { Draggable } from "react-beautiful-dnd";

import DeleteModal from "./DeleteModal";
import Pane from "./Pane";

const { Menu, MenuItem } = Dropdown;

const MenuBarItem = ({
  id,
  index,
  refetch,
  category,
  categories,
  activeCategory,
  setActiveCategory,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  if (showEdit) {
    return (
      <Pane
        activeCategory={activeCategory}
        isEdit={showEdit}
        refetch={refetch}
        setShowEdit={setShowEdit}
      />
    );
  }

  return (
    <Draggable
      draggableId={category.id.toString()}
      index={index}
      key={category.id}
    >
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mt-3 flex w-full justify-between p-3 ${
            activeCategory.id === id && "neeto-ui-bg-primary-100"
          }`}
          onClick={() => setActiveCategory(category)}
        >
          <div>
            <Typography style="h5">{category.name}</Typography>
            <Typography style="body3">{`${category.count} ${
              category.count > 1 ? "Articles" : "Article"
            }`}</Typography>
          </div>
          <Dropdown buttonStyle="text" icon={MenuVertical}>
            <Menu>
              <MenuItem.Button onClick={() => setShowEdit(true)}>
                Edit
              </MenuItem.Button>
              <MenuItem.Button
                style="danger"
                onClick={() => setShowModal(true)}
              >
                Delete
              </MenuItem.Button>
            </Menu>
          </Dropdown>
          {showModal && (
            <DeleteModal
              categories={categories}
              refetch={refetch}
              selectedCategory={category}
              setShowModal={setShowModal}
              showModal={showModal}
            />
          )}
        </div>
      )}
    </Draggable>
  );
};

export default MenuBarItem;
