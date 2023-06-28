import React, { useState } from "react";

import { DatePicker } from "antd";
import { Modal, Button, Typography } from "neetoui";
import { isEmpty } from "ramda";
import { useHistory } from "react-router-dom";

import TooltipWrapper from "common/TooltipWrapper";
import useCreateArticle from "hooks/reactQuery/articles/useCreate";
import useUpdateArticle from "hooks/reactQuery/articles/useUpdate";

import { defaultTime, disabledDate, formatPayload } from "./utils";

const DatePickerModal = ({
  showModal,
  setShowModal,
  isEdit,
  formValues,
  initialStatus,
}) => {
  const [dateAndTime, setDateAndTime] = useState("");

  const history = useHistory();

  const { mutate: updateArticle } = useUpdateArticle({
    onSuccess: () => history.push("/"),
    onError: error => {
      setShowModal(false);
      logger.error(error);
    },
  });

  const { mutate: createArticle } = useCreateArticle({
    onSuccess: () => history.push("/"),
    onError: error => {
      setShowModal(false);
      logger.error(error);
    },
  });

  const handleChange = (_, dateAndTime) => {
    const datetime = isEmpty(dateAndTime)
      ? ""
      : dateAndTime.concat(":00 +0530");
    setDateAndTime(datetime);
  };

  const handleSubmit = () => {
    const payload = formatPayload(formValues, initialStatus, dateAndTime);
    if (isEdit) {
      updateArticle({ id: formValues.id, payload });
    } else {
      createArticle(payload);
    }
  };

  return (
    <Modal
      closeButton={false}
      isOpen={showModal}
      onClose={() => setShowModal(false)}
    >
      <div className="p-4">
        <DatePicker
          className="w-full"
          disabledDate={disabledDate}
          format="DD-MM-YYYY HH:mm"
          placeholder="Select Date and Time"
          showTime={defaultTime}
          size="small"
          onChange={handleChange}
        />
        <div className="mt-2 flex space-x-2">
          <TooltipWrapper
            content="Select Date and Time"
            disabled={dateAndTime === ""}
          >
            <Button
              disabled={dateAndTime === ""}
              label="Proceed"
              size="small"
              style="primary"
              onClick={() => handleSubmit()}
            />
          </TooltipWrapper>
          <Button
            label="Cancel"
            size="small"
            style="text"
            onClick={() => setShowModal(false)}
          />
        </div>
        {!isEdit && (
          <Typography className="mt-2" style="body3">
            Note: Article will be create as Draft.
          </Typography>
        )}
      </div>
    </Modal>
  );
};

export default DatePickerModal;
