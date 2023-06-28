import React from "react";

import { Typography } from "neetoui";

import { formatDateToTimeDate } from "../utils";

const CurrentVersion = ({ article }) => (
  <div className="border neeto-ui-bg-primary-100 sticky top-0 z-20 box-border flex rounded-sm px-4 py-2">
    <div className="w-3/4">
      <Typography style="body3">
        Current Version <br />
        {formatDateToTimeDate(article.updatedAt)}
        {article.restored && (
          <>
            <br />
            Restored from {formatDateToTimeDate(article.restoredFrom)}
          </>
        )}
      </Typography>
    </div>
    <div className="flex w-1/4 items-center">
      <Typography style="body3">{article.status}</Typography>
    </div>
  </div>
);

export default CurrentVersion;
