import { Settings, Repeat, Seo } from "neetoicons";
import * as yup from "yup";

export const SIDEBAR_ITEMS = [
  {
    id: 1,
    icon: Settings,
    title: "General",
    description: "Page Title, Brand Name & Meta Description",
    tab: "general",
  },
  {
    id: 2,
    icon: Repeat,
    title: "Redirections",
    description: "Create & configure redirection rules",
    tab: "redirections",
  },
  {
    id: 3,
    icon: Seo,
    title: "Manage Categories",
    description: "Edit and Reorder KB Structure",
    tab: "managecategories",
  },
];

export const GENERAL_SETTINGS_FORM_INITIAL_DATA = {
  name: "",
  password: "",
  isPasswordProtected: null,
};

export const GENERAL_SETTINGS_FORM_VALIDATION_SCHEMA = (
  isChangePassword,
  checkboxValue
) =>
  yup.object().shape({
    name: yup.string().required("Organization name cannot be empty."),
    password:
      isChangePassword && checkboxValue
        ? yup
            .string()
            .min(6, "Password should have at least 6 characters")
            .matches(
              "^([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*",
              "Password should contain at least one letter and one digit"
            )
            .required("Password cannot be empty.")
        : yup.string().notRequired(),
  });

export const REDIRECTION_FORM_VALIDATION_SCHEMA = yup.object().shape({
  from: yup
    .string()
    .required("From Path is required")
    .matches(/^\/[a-zA-Z0-9/?&=]+$/i, "From must be in the format of '/path'"),
  to: yup
    .string()
    .required("To Path is required")
    .matches(
      /^\/[a-zA-Z0-9/?&=]+$/i,
      "To Path must be in the format of '/path'"
    )
    .notOneOf([yup.ref("from"), null], "From and To Path must be different"),
});
