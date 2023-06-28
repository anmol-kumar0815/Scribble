import React, { useState } from "react";

import { Formik, Form as FormikForm } from "formik";
import { Button, Typography, Alert } from "neetoui";
import { Input, Checkbox } from "neetoui/formik";
import { useHistory } from "react-router-dom";

import organizationApi from "apis/admin/organization";
import TooltipWrapper from "common/TooltipWrapper";

import { GENERAL_SETTINGS_FORM_VALIDATION_SCHEMA } from "../constants";

const Form = ({ formInitialValues }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(
    formInitialValues.isPasswordProtected
  );
  const [isChangePassword, setIsChangePassword] = useState(
    !formInitialValues.isPasswordProtected
  );
  const [formValues, setFormValues] = useState({});

  const history = useHistory();

  const handleSubmit = async values => {
    try {
      await organizationApi.update({
        name: values.name,
        password: values.password,
        is_password_protected:
          formInitialValues.isPasswordProtected === checkboxValue &&
          !isChangePassword
            ? null
            : values.isPasswordProtected,
      });
      localStorage.setItem("authToken", null);
      history.go(0);
    } catch (error) {
      logger.error(error);
    }
  };

  const handleCheckIsDestroyingPassword = values => {
    setFormValues(values);
    if (formInitialValues.isPasswordProtected && !values.isPasswordProtected) {
      setShowAlert(true);
    } else {
      handleSubmit(values);
    }
  };

  return (
    <>
      <Formik
        initialValues={{
          name: formInitialValues.name,
          isPasswordProtected: formInitialValues.isPasswordProtected,
        }}
        validationSchema={GENERAL_SETTINGS_FORM_VALIDATION_SCHEMA(
          isChangePassword,
          checkboxValue
        )}
        onSubmit={handleCheckIsDestroyingPassword}
      >
        {({ isSubmitting, dirty, setFieldValue }) => (
          <FormikForm className="mt-6">
            <Input
              id="name"
              label="Organization Name"
              name="name"
              placeholder="Write organization name here."
            />
            <Typography className="text-gray-600" style="body3">
              Customize the site name which is used to show the site name in
              Open
            </Typography>
            <Typography style="h6">Graph Tags.</Typography>
            <hr className="mt-4 mb-3" />
            <Checkbox
              checked={checkboxValue}
              id="isPasswordProtected"
              name="isPasswordProtected"
              label={
                <Typography style="h5">
                  Password Protect Knowledge Base
                </Typography>
              }
              onChange={() => {
                setCheckboxValue(checkboxValue => !checkboxValue);
                setFieldValue("isPasswordProtected", !checkboxValue);
              }}
            />
            {checkboxValue && (
              <>
                <TooltipWrapper
                  content="Click on change password button to type new password"
                  position="bottom"
                  disabled={
                    !isChangePassword && formInitialValues.isPasswordProtected
                  }
                >
                  <Input
                    required
                    className="mt-4"
                    id="password"
                    label="Password"
                    name="password"
                    placeholder={!isChangePassword ? "******" : "Type Password"}
                    type="password"
                    disabled={
                      !isChangePassword && formInitialValues.isPasswordProtected
                    }
                  />
                </TooltipWrapper>
                {formInitialValues.isPasswordProtected && (
                  <Button
                    className="mt-2"
                    disabled={isChangePassword}
                    label="Change Password"
                    size="small"
                    onClick={() => setIsChangePassword(true)}
                  />
                )}
              </>
            )}
            <div className="mt-6 flex">
              <TooltipWrapper
                content="Make some change to update it."
                disabled={isSubmitting || !dirty}
                position="bottom"
              >
                <Button
                  disabled={isSubmitting || !dirty}
                  label="Save Changes"
                  type="submit"
                />
              </TooltipWrapper>
              <Button
                label="Cancel"
                style="text"
                type="reset"
                onClick={() => {
                  setCheckboxValue(formInitialValues.isPasswordProtected);
                  setIsChangePassword(!formInitialValues.isPasswordProtected);
                }}
              />
            </div>
          </FormikForm>
        )}
      </Formik>
      {showAlert && (
        <Alert
          isOpen={showAlert}
          title="Your saved password will be unsave. Are you sure you want to continue?"
          onClose={() => setShowAlert(false)}
          onSubmit={() => {
            setShowAlert(false);
            handleSubmit(formValues);
          }}
        />
      )}
    </>
  );
};

export default Form;
