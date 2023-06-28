import * as yup from "yup";

export const CREATE_ARTICLE_INITIAL_FORM_DATA = {
  title: "",
  category: null,
  body: "",
  status: "Draft",
};

export const CREATE_ARTICLE_FORM_VALIDATION_SCHEMA = CATEGORIES_OPTIONS =>
  yup.object().shape({
    title: yup
      .string()
      .matches(
        /\w*[aA-zZ0-9]\w*/,
        "Title should contain at least a number or a letter"
      )
      .max(50, "Title must be in between 1 and 50 characters.")
      .required("Article title cannot be empty"),
    body: yup.string().required("Article body cannot be empty"),
    category: yup
      .object()
      .nullable()
      .shape({
        label: yup
          .string()
          .oneOf(
            CATEGORIES_OPTIONS.map(categoryOption => categoryOption.label)
          ),
        value: yup
          .string()
          .oneOf(
            CATEGORIES_OPTIONS.map(categoryOption => categoryOption.value)
          ),
      })
      .required("Article category cannot be empty"),
  });

export const COLUMN_DROPDOWN_MENU_ITEMS = [
  {
    id: "title",
    label: "Title",
  },
  {
    id: "updatedAt",
    label: "Date",
  },
  {
    id: "user",
    label: "Author",
  },
  {
    id: "category",
    label: "Category",
  },
  {
    id: "status",
    label: "Status",
  },
];

export const displayColumnData = {
  title: true,
  updatedAt: true,
  user: true,
  category: true,
  status: true,
};

export const countInitialValues = {
  all: 0,
  draft: 0,
  published: 0,
};

export const filtrationConstraintsData = {
  searchedTitle: "",
  selectedStatus: "All",
  selectedCategoryIds: [],
  page: 1,
};
