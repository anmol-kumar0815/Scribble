import React from "react";

import { Typography } from "neetoui";

import Table from "./Table";

const Redirections = () => (
  <div className="flex w-full justify-center">
    <div className="ml-32 w-1/2 pl-32 pt-6">
      <Typography style="h2">Redirections</Typography>
      <Typography className="text-gray-600" style="body1">
        Create and configure redirection rules to send users from old links to
        new new new new links. All redirections are performed with 301 status
        codes friendly.
      </Typography>
      <div className="neeto-ui-bg-primary-100 mt-3 px-6 py-8">
        <Table />
      </div>
    </div>
  </div>
);

export default Redirections;
