import React from "react";

import { Typography } from "neetoui";
import { useRouteMatch, NavLink } from "react-router-dom";

import { SIDEBAR_ITEMS } from "./constants";

const SideBar = ({ active }) => {
  const { url } = useRouteMatch();

  return (
    <div className="border fixed left-0 flex h-screen w-1/4 flex-col">
      {SIDEBAR_ITEMS.map(sidebarItem => (
        <NavLink
          key={sidebarItem.id}
          to={`${url}?tab=${sidebarItem.tab}`}
          className={`h-18 mx-2 my-2 px-2 py-3 ${
            active === sidebarItem.tab &&
            "neeto-ui-bg-primary-100 neeto-ui-rounded-sm"
          }`}
        >
          <div className="mx-4 flex">
            <sidebarItem.icon className="my-1 mx-2" />
            <div>
              <Typography style="h4">{sidebarItem.title}</Typography>
              <Typography style="body3">{sidebarItem.description}</Typography>
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default SideBar;
