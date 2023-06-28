import dayjs from "dayjs";
import { evolve } from "ramda";

const getCurrentStatus = currentStatus => {
  let status = "";
  if (currentStatus === "Save Draft") {
    status = "Draft";
  } else if (currentStatus === "Publish") {
    status = "Published";
  } else if (currentStatus === "Publish Later") {
    status = "publish later";
  } else if (currentStatus === "Unpublish Later") {
    status = "unpublish later";
  }

  return status;
};

export const formatFormData = ({ formValues, initailFormValue }) => ({
  ...formValues,
  category_id: formValues.category.value,
  publish_at:
    formValues.status === "Published" ? null : initailFormValue.publishAt,
  unpublish_at:
    formValues.status === "Draft" ? null : initailFormValue.unpublishAt,
  restored: false,
  restored_from: null,
});

export const buildMenuItems = (article, isEdit) => {
  const menuItems = ["Publish", "Save Draft"];
  if (article.status === "Published" && article?.unpublishAt === null) {
    menuItems.push("Unpublish Later");
  } else if (article.status === "Draft" && article?.publishAt === null) {
    menuItems.push("Publish Later");
  } else if (
    article.status === "Draft" &&
    article?.publishAt !== null &&
    article?.unpublishAt === null
  ) {
    menuItems.push("Unpublish Later");
  } else if (
    article.status === "Published" &&
    article?.unpublishAt !== null &&
    article?.publishAt === null
  ) {
    menuItems.push("Publish Later");
  } else if (!isEdit) {
    menuItems.push("Publish Later");
  }

  return menuItems;
};

export const updateLabel = ({ setButtonLabel, setFieldValue, menuItem }) => {
  setButtonLabel(menuItem);
  setFieldValue("status", getCurrentStatus(menuItem));
};

export const defaultTime = { defaultValue: dayjs("00:00", "HH:mm") };

export const disabledDate = current =>
  current && current < dayjs().startOf("day");

export const formatPayload = (formValues, initialStatus, dateAndTime) => {
  const payload = {
    title: formValues.title,
    body: formValues.body,
    category_id: formValues.category.value,
    restored: false,
    restored_from: null,
  };

  if (formValues.status === "publish later") {
    payload.publish_at = dateAndTime;
  } else {
    payload.unpublish_at = dateAndTime;
  }
  payload.status = initialStatus;

  return payload;
};

export const formatDateToTimeDate = dateTime =>
  dayjs(dateTime).format("hh:mmA, DD/MM/YYYY");

export const buildMessage = (schedule, status, initailFormValue) => {
  let message = "";
  if (
    status === "Draft" &&
    schedule === "publishAt" &&
    initailFormValue?.unpublishAt !== null
  ) {
    message = `Cancel publish schedule of ${formatDateToTimeDate(
      initailFormValue.publishAt
    )} ? This will also cancel unpublish schedule of  ${formatDateToTimeDate(
      initailFormValue.unpublishAt
    )}. Are you sure you want to continue?`;
  } else if (
    status === "Published" &&
    schedule === "unpublishAt" &&
    initailFormValue?.publishAt !== null
  ) {
    message = `Cancel unpublish schedule of ${formatDateToTimeDate(
      initailFormValue.unpublishAt
    )} ? This will also cancel publish schedule of  ${formatDateToTimeDate(
      initailFormValue.publishAt
    )}. Are you sure you want to continue?`;
  } else if (schedule === "publishAt") {
    message = `Cancel publish schedule of ${formatDateToTimeDate(
      initailFormValue.publishAt
    )} ?`;
  } else if (schedule === "unpublishAt") {
    message = `Cancel unpublish schedule of ${formatDateToTimeDate(
      initailFormValue.unpublishAt
    )} ?`;
  }

  return message;
};

export const updateInitialFormValue = (
  setInitialFormValue,
  scheduleToBeCancel,
  initailFormValue
) => {
  let payload = {};
  if (scheduleToBeCancel === "publishAt") {
    payload = {
      publish_at: null,
      unpublish_at:
        initailFormValue.status === "Draft"
          ? null
          : initailFormValue.unpublishAt,
    };
  } else if (scheduleToBeCancel === "unpublishAt") {
    payload = {
      unpublish_at: null,
      publish_at:
        initailFormValue.status === "Published"
          ? null
          : initailFormValue.publishAt,
    };
  }
  setInitialFormValue(
    evolve({
      publishAt: () => payload?.publish_at,
      unpublishAt: () => payload?.unpublish_at,
    })
  );
};
