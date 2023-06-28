import * as yup from "yup";

export const ADD_CATEGORY_FORM_INITIAL_VALUE = {
  name: "",
};
export const ADD_CATEGORY_FORM_VALIDATION_SCHEMA = yup.object().shape({
  name: yup.string().required("Category name cannot be empty.").trim(),
});

export const ORDER_BY_OPTIONS = [
  {
    label: "None",
    value: "none",
  },
  {
    label: "Alphabetical Title",
    value: "title",
  },
  {
    label: "Newly Modified",
    value: "updated_at",
  },
  {
    label: "Visits Count",
    value: "visits",
  },
  {
    label: "Created Date",
    value: "created_at",
  },
];
