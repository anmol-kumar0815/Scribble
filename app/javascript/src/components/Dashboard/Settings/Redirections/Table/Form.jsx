import React from "react";

import { Formik, Form as FormikForm } from "formik";
import { Check, Close } from "neetoicons";
import { Button } from "neetoui";
import { Input } from "neetoui/formik";

import redirectionsApi from "apis/admin/redirections";
import TooltipWrapper from "common/TooltipWrapper";

import { REDIRECTION_FORM_VALIDATION_SCHEMA } from "../../constants";

const Form = ({
  setCurrentEditLinkId,
  initialValues,
  isEdit,
  setShowAddRedirection,
  refetch,
}) => {
  const handleSubmit = async values => {
    try {
      const id = initialValues.id;
      if (isEdit) {
        setCurrentEditLinkId(null);
        await redirectionsApi.update(id, { from: values.from, to: values.to });
      } else {
        setShowAddRedirection(false);
        await redirectionsApi.create(values);
      }
      refetch();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Formik
      validateOnChange
      initialValues={initialValues}
      validationSchema={REDIRECTION_FORM_VALIDATION_SCHEMA}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, dirty, isValid }) => (
        <FormikForm className="mt-2 flex gap-x-3 bg-white p-4">
          <Input required name="from" placeholder="/from" />
          <Input required name="to" placeholder="/to" />
          <TooltipWrapper
            content={isEdit ? "Make some change to update it" : "Add paths"}
            disabled={!dirty}
            position="bottom"
          >
            <Button
              disabled={isSubmitting || !(isValid && dirty)}
              icon={Check}
              style="text"
              type="submit"
            />
          </TooltipWrapper>
          <Button
            icon={Close}
            style="text"
            type="reset"
            onClick={() => {
              isEdit
                ? setCurrentEditLinkId(null)
                : setShowAddRedirection(false);
            }}
          />
        </FormikForm>
      )}
    </Formik>
  );
};

export default Form;
