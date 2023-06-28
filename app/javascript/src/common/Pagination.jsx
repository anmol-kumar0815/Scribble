import React from "react";

import { Typography, Pagination as NeetoUIPagination } from "neetoui";

const Pagination = ({
  count,
  setCurrentPageNumber,
  currentPageNumber,
  pageSize,
}) => (
  <div className="mt-4 flex justify-between">
    {count > 0 && (
      <Typography className="ml-4" style="h4">
        {(currentPageNumber - 1) * pageSize + 1} -&nbsp;
        {currentPageNumber * pageSize < count
          ? currentPageNumber * pageSize
          : count}
        &nbsp;of {count}
      </Typography>
    )}
    <NeetoUIPagination
      count={count}
      navigate={pageNumber => setCurrentPageNumber(pageNumber)}
      pageNo={currentPageNumber}
      pageSize={pageSize}
    />
  </div>
);

export default Pagination;
