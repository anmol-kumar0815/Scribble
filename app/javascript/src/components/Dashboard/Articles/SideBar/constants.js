import * as yup from "yup";

export const CATEGORY_FORM_INITIAL_VALUE = {
  name: "",
};

export const CATEGORY_FORM_VALIDATION_SCHEMA = yup.object().shape({
  name: yup.string().trim().required("Category name cannot be empty"),
});

export const STATUS_MENUBAR_LIST_ITEMS = [
  {
    id: "all",
    label: "All",
  },
  {
    id: "draft",
    label: "Draft",
  },
  {
    id: "published",
    label: "Published",
  },
];
