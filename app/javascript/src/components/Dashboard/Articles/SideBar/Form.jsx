import React from "react";

import { Formik, Form as FormikForm } from "formik";
import { Check, Close } from "neetoicons";
import { Button } from "neetoui";
import { Input } from "neetoui/formik";

import categoriesApi from "apis/admin/categories";
import TooltipWrapper from "common/TooltipWrapper";

import {
  CATEGORY_FORM_INITIAL_VALUE,
  CATEGORY_FORM_VALIDATION_SCHEMA,
} from "./constants";

const Form = ({ fetchCategories, setIsAddCategoryCollapsed }) => {
  const handleSubmit = async (values, { resetForm }) => {
    resetForm();
    try {
      await categoriesApi.create({ name: values.name });
      fetchCategories();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Formik
      initialValues={CATEGORY_FORM_INITIAL_VALUE}
      validationSchema={CATEGORY_FORM_VALIDATION_SCHEMA}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, dirty, isValid }) => (
        <FormikForm>
          <div className="flex">
            <Input required name="name" />
            <TooltipWrapper
              content="Write category name to submit"
              disabled={!isSubmitting && !(isValid && dirty)}
              position="bottom"
            >
              <Button
                disabled={!isSubmitting && !(isValid && dirty)}
                icon={Check}
                style="text"
                type="submit"
              />
            </TooltipWrapper>
            <Button
              icon={Close}
              style="text"
              type="reset"
              onClick={() => setIsAddCategoryCollapsed(true)}
            />
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};

export default Form;
