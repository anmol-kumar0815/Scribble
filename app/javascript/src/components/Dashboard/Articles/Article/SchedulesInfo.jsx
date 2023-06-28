import React, { useState, useEffect } from "react";

import { Callout, Alert } from "neetoui";

import useUpdateArticle from "hooks/reactQuery/articles/useUpdate";

import {
  formatDateToTimeDate,
  buildMessage,
  updateInitialFormValue,
} from "./utils";

const SchedulesInfo = ({ initailFormValue, setInitialFormValue }) => {
  const [formValues, setFormValues] = useState(initailFormValue);
  const [showAlert, setShowAlert] = useState(false);
  const [scheduleToBeCancel, setScheduleToBeCancel] = useState(false);
  const [message, setMessage] = useState("");

  const { mutate: updateArticle } = useUpdateArticle({
    onSuccess: () =>
      updateInitialFormValue(
        setInitialFormValue,
        scheduleToBeCancel,
        initailFormValue
      ),
    onError: error => logger.error(error),
  });

  const handleCancelPublishLaterSchedule = () => {
    setShowAlert(false);
    const id = formValues.id;
    const payload = {
      publish_at: null,
      unpublish_at:
        initailFormValue.status === "Draft"
          ? null
          : initailFormValue.unpublishAt,
    };
    updateArticle({ id, payload });
  };

  const handleCancelUnpublishLaterSchedule = () => {
    setShowAlert(false);
    const id = formValues.id;
    const payload = {
      unpublish_at: null,
      publish_at:
        initailFormValue.status === "Published"
          ? null
          : initailFormValue.publishAt,
    };
    updateArticle({ id, payload });
  };

  const handleShowAlert = (schedule, status) => {
    setShowAlert(true);
    setScheduleToBeCancel(schedule);
    const message = buildMessage(schedule, status, initailFormValue);
    setMessage(message);
  };

  useEffect(() => {
    setFormValues(initailFormValue);
  }, [initailFormValue]);

  if (formValues.status === "Draft") {
    return (
      <>
        {formValues.publishAt && (
          <Callout style="success">
            Article will be publish at &nbsp;
            {formatDateToTimeDate(formValues.publishAt)}
            <span
              className="cursor-pointer text-blue-600 underline"
              onClick={() => handleShowAlert("publishAt", "Draft")}
            >
              Click Here
            </span>
            to cancel this schedule.
          </Callout>
        )}
        {formValues.unpublishAt && (
          <Callout className="mt-2" style="warning">
            Article will be unpublish at &nbsp;
            {formatDateToTimeDate(formValues.unpublishAt)}
            <span
              className="cursor-pointer text-blue-600 underline"
              onClick={() => handleShowAlert("unpublishAt", "Draft")}
            >
              Click Here
            </span>
            to cancel this schedule.
          </Callout>
        )}
        <Alert
          isOpen={showAlert}
          message={message}
          title="Cancel Schedule ?"
          onClose={() => setShowAlert(false)}
          onSubmit={() =>
            scheduleToBeCancel === "publishAt"
              ? handleCancelPublishLaterSchedule()
              : handleCancelUnpublishLaterSchedule()
          }
        />
      </>
    );
  }

  return (
    <>
      {formValues.unpublishAt && (
        <Callout style="warning">
          Article will be unpublish at &nbsp;
          {formatDateToTimeDate(formValues.unpublishAt)}
          <span
            className="cursor-pointer text-blue-600 underline"
            onClick={() => handleShowAlert("unpublishAt", "Published")}
          >
            Click Here
          </span>
          to cancel this schedule.
        </Callout>
      )}
      {formValues.publishAt && (
        <Callout className="mt-2" style="success">
          Article will be publish at &nbsp;
          {formatDateToTimeDate(formValues.publishAt)}
          <span
            className="cursor-pointer text-blue-600 underline"
            onClick={() => handleShowAlert("publishAt", "Published")}
          >
            Click Here
          </span>
          to cancel this schedule.
        </Callout>
      )}
      <Alert
        isOpen={showAlert}
        message={message}
        title="Cancel Schedule ?"
        onClose={() => setShowAlert(false)}
        onSubmit={() =>
          scheduleToBeCancel === "publishAt"
            ? handleCancelPublishLaterSchedule()
            : handleCancelUnpublishLaterSchedule()
        }
      />
    </>
  );
};

export default SchedulesInfo;
