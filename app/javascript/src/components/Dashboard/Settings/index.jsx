import React from "react";

import { useLocation } from "react-router-dom";

import General from "./General";
import InvalidTab from "./InvalidTab";
import ManageCategories from "./ManageCategories";
import Redirections from "./Redirections";
import SideBar from "./SideBar";

const Settings = () => {
  const searchParams = new URLSearchParams(useLocation().search);
  const currentTab = searchParams.get("tab");

  const currentComponent = currentTab => {
    let component;
    if (currentTab === "general") {
      component = <General />;
    } else if (currentTab === "redirections") {
      component = <Redirections />;
    } else if (currentTab === "managecategories") {
      component = <ManageCategories />;
    } else {
      component = <InvalidTab />;
    }

    return component;
  };

  return (
    <div className="flex w-full">
      <SideBar active={currentTab} />
      {currentComponent(currentTab)}
    </div>
  );
};

export default Settings;
