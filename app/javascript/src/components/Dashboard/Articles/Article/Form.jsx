import React, { useState, useEffect } from "react";

import { Formik, Form as FormikForm } from "formik";
import { Button, PageLoader, Alert } from "neetoui";
import { Input, Textarea, Select } from "neetoui/formik";
import { useHistory } from "react-router-dom";

import articlesApi from "apis/admin/articles";
import categoriesApi from "apis/admin/categories";
import TooltipWrapper from "common/TooltipWrapper";

import DatePickerModal from "./DatePickerModal";
import SchedulesInfo from "./SchedulesInfo";
import StatusDropdown from "./StatusDropdown";
import { formatFormData, formatDateToTimeDate } from "./utils";

import { buildCategoryOptions } from "../../Articles/utils";
import { CREATE_ARTICLE_FORM_VALIDATION_SCHEMA } from "../constants";

const Form = ({ initailFormValue, setInitialFormValue, isEdit, id }) => {
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [buttonLabel, setButtonLabel] = useState(
    initailFormValue.status === "Published" ? "Publish" : "Save Draft"
  );
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formValues, setFormValues] = useState({});

  const history = useHistory();

  const fetchCategories = async () => {
    try {
      const {
        data: { categories },
      } = await categoriesApi.list({ searchedName: "" });
      const categoryOptions = buildCategoryOptions(categories);
      setCategoryOptions(categoryOptions);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async values => {
    const formData = formatFormData({ formValues: values, initailFormValue });
    try {
      if (isEdit) {
        await articlesApi.update(id, formData);
      } else {
        await articlesApi.create(formData);
      }
      history.push("/");
    } catch (error) {
      logger.error(error);
    }
  };

  const handleShowAlert = values => {
    setFormValues(values);
    if (initailFormValue.publishAt !== null && values.status === "Published") {
      setShowAlert(true);
    } else if (
      initailFormValue.unpublishAt !== null &&
      values.status === "Draft"
    ) {
      setShowAlert(true);
    } else {
      handleSubmit(values);
    }
  };

  const handleShowDatePicker = values => {
    setFormValues(values);
    setShowModal(true);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      <SchedulesInfo
        initailFormValue={initailFormValue}
        setInitialFormValue={setInitialFormValue}
      />
      <Formik
        initialValues={initailFormValue}
        validateOnBlur={submitted}
        validateOnChange={submitted}
        validationSchema={CREATE_ARTICLE_FORM_VALIDATION_SCHEMA(
          categoryOptions
        )}
        onSubmit={
          buttonLabel === "Publish Later" || buttonLabel === "Unpublish Later"
            ? handleShowDatePicker
            : handleShowAlert
        }
      >
        {({ dirty, isValid, setFieldValue }) => (
          <FormikForm className="mt-2 w-full">
            <div className="flex gap-x-4">
              <Input
                required
                className="w-7/12"
                label="Article Title"
                name="title"
                placeholder="Write title of your article here."
              />
              <Select
                isSearchable
                required
                label="Category"
                name="category"
                options={categoryOptions}
                placeholder="Select a category"
              />
            </div>
            <Textarea
              required
              className="mt-5"
              label="Article Body"
              name="body"
              placeholder="Write your article body here."
              rows={10}
            />
            <div className="mt-2 flex">
              <TooltipWrapper
                content="Make some change in article to update it."
                disabled={!dirty}
                position="bottom"
              >
                <Button
                  className="mr-px"
                  disabled={!(isValid && dirty)}
                  label={buttonLabel}
                  name="status"
                  size="medium"
                  style="primary"
                  type="submit"
                  onClick={() => setSubmitted(true)}
                />
              </TooltipWrapper>
              <StatusDropdown
                article={initailFormValue}
                isEdit={isEdit}
                setButtonLabel={setButtonLabel}
                setFieldValue={setFieldValue}
                setSubmitted={setSubmitted}
              />
              <Button
                className="ml-2"
                label="Cancel"
                style="text"
                type="reset"
                onClick={() => history.push("/")}
              />
            </div>
          </FormikForm>
        )}
      </Formik>
      <DatePickerModal
        formValues={formValues}
        initialStatus={initailFormValue.status}
        isEdit={isEdit}
        setShowModal={setShowModal}
        showModal={showModal}
      />
      <Alert
        isOpen={showAlert}
        message={
          formValues.status === "Draft"
            ? `This article has a unpublish schedule at ${formatDateToTimeDate(
                formValues.unpublishAt
              )}. If you wish to unpublish it right now, then unpublish schedule will be cancelled.`
            : `This article has a publish schedule at ${formatDateToTimeDate(
                formValues.publishAt
              )}. If you wish to publish it right now, then publish schedule will be cancelled.`
        }
        title={
          formValues.status === "Draft"
            ? "Unpublish it right now?"
            : "Publish it right now?"
        }
        onClose={() => setShowAlert(false)}
        onSubmit={() => handleSubmit(formValues)}
      />
    </>
  );
};
export default Form;
