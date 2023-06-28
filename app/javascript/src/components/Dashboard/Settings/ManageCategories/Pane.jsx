import React, { useRef } from "react";

import { Formik, Form as FormikForm } from "formik";
import { Button, Pane as NeetoUIPane, Typography } from "neetoui";
import { Input } from "neetoui/formik";

import categoriesApi from "apis/admin/categories";
import TooltipWrapper from "common/TooltipWrapper";

import {
  ADD_CATEGORY_FORM_INITIAL_VALUE,
  ADD_CATEGORY_FORM_VALIDATION_SCHEMA,
} from "./constant";

const Pane = ({
  setShowAddCategory,
  refetch,
  activeCategory,
  isEdit,
  setShowEdit,
}) => {
  const inputRef = useRef(null);

  const handleSubmit = async (values, { resetForm }) => {
    resetForm();
    try {
      if (isEdit) {
        setShowEdit(false);
        await categoriesApi.update(activeCategory.id, values);
      } else {
        setShowAddCategory(false);
        await categoriesApi.create({ name: values.name });
      }
      refetch();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <NeetoUIPane
      isOpen
      initialFocusRef={inputRef}
      onClose={() => (isEdit ? setShowEdit(false) : setShowAddCategory(false))}
    >
      <NeetoUIPane.Header>
        <Typography style="h2" weight="semibold">
          {isEdit ? "Edit Category" : "Add Category"}
        </Typography>
      </NeetoUIPane.Header>
      <Formik
        validationSchema={ADD_CATEGORY_FORM_VALIDATION_SCHEMA}
        initialValues={
          isEdit
            ? { name: activeCategory.name }
            : ADD_CATEGORY_FORM_INITIAL_VALUE
        }
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, dirty, isValid }) => (
          <FormikForm>
            <NeetoUIPane.Body>
              <Input
                className="w-full"
                label="Category Name"
                name="name"
                ref={inputRef}
                type="text"
              />
            </NeetoUIPane.Body>
            <NeetoUIPane.Footer>
              <TooltipWrapper
                disabled={!dirty}
                position="right"
                content={
                  isEdit
                    ? "Make some change to update it."
                    : "Enter category name to save it."
                }
              >
                <Button
                  disabled={isSubmitting || !(isValid && dirty)}
                  label={isEdit ? "Update" : "Create"}
                  style="primary"
                  type="submit"
                />
              </TooltipWrapper>
              <Button
                label="cancel"
                style="text"
                onClick={() =>
                  isEdit ? setShowEdit(false) : setShowAddCategory(false)
                }
              />
            </NeetoUIPane.Footer>
          </FormikForm>
        )}
      </Formik>
    </NeetoUIPane>
  );
};

export default Pane;
