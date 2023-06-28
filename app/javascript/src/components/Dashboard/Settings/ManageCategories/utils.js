import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const categoriesExceptSelectedCategory = (
  categories,
  selectedCategory
) =>
  categories
    .filter(category => category.id !== selectedCategory.id)
    .map(category => ({
      label: category.name,
      value: category.id,
    }));

export const calculateCreatedAgo = dateTime => dayjs(dateTime).fromNow();

export const dateInLongFormat = dateTime =>
  dayjs(dateTime).format("dddd MMMM DD, YYYY hh:mm A");

export const getCurrentOrderBy = orderBy => {
  let defaultValue = "";

  if ("none" === orderBy) {
    defaultValue = "None";
  } else if ("title" === orderBy) {
    defaultValue = "Alphabetical Title";
  } else if ("updated_at" === orderBy) {
    defaultValue = "Newly Modified";
  } else if ("visits" === orderBy) {
    defaultValue = "Visits Count";
  } else if ("created_at" === orderBy) {
    defaultValue = "Created Date";
  }

  return defaultValue;
};
