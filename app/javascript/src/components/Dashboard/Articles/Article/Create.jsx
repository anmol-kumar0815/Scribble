import React from "react";

import Form from "./Form";

import { CREATE_ARTICLE_INITIAL_FORM_DATA } from "../constants";

const Create = () => (
  <div className="mx-auto max-w-screen-sm py-6">
    <Form initailFormValue={CREATE_ARTICLE_INITIAL_FORM_DATA} isEdit={false} />
  </div>
);

export default Create;
