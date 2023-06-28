import React from "react";

import { Tooltip } from "neetoui";

const TooltipWrapper = ({ disabled, children, ...tooltipProps }) => {
  if (disabled) {
    return (
      <Tooltip {...tooltipProps}>
        <div>{children}</div>
      </Tooltip>
    );
  }

  return children;
};

export default TooltipWrapper;
