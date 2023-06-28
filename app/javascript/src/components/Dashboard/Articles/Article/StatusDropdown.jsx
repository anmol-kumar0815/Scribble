import React from "react";

import { Dropdown } from "neetoui";

import { buildMenuItems, updateLabel } from "./utils";

const { Menu, MenuItem } = Dropdown;

const StatusDropdown = ({
  setButtonLabel,
  setFieldValue,
  setSubmitted,
  article,
  isEdit,
}) => {
  const menuItems = buildMenuItems(article, isEdit);

  return (
    <Dropdown className="mr-3" type="submit" onClick={() => setSubmitted(true)}>
      <Menu>
        {menuItems.map((menuItem, index) => (
          <MenuItem.Button
            key={index}
            onClick={() =>
              updateLabel({ setFieldValue, setButtonLabel, menuItem })
            }
          >
            {menuItem}
          </MenuItem.Button>
        ))}
      </Menu>
    </Dropdown>
  );
};

export default StatusDropdown;
