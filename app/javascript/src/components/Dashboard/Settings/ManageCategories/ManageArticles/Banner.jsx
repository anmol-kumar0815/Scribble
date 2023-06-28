import React from "react";

import { Typography } from "neetoui";

const Banner = ({ setShowBanner }) => {
  const handleBannerDisplay = () => {
    setShowBanner(false);
    localStorage.setItem("showBanner", JSON.stringify(false));
  };

  return (
    <div className="neeto-ui-bg-primary-100 p-2">
      <Typography style="body3">
        You can reorder categories or articles by drag and drop here. You can
        also multiselect articles and move them together to any category you
        have created.&nbsp;
        <span
          className="cursor-pointer underline"
          onClick={() => handleBannerDisplay()}
        >
          Don't show this info again.
        </span>
      </Typography>
    </div>
  );
};

export default Banner;
