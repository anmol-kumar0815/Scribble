import React from "react";

import dayjs from "dayjs";
import { Delete, Edit, Clock } from "neetoicons";
import { Typography, Button } from "neetoui";
import { Link } from "react-router-dom";

import TooltipWrapper from "common/TooltipWrapper";

const handleOpenEUI = (event, slug) => {
  event.stopPropagation();
  const url = `${window.location.href}public/${slug}`;
  window.open(url, "_blank");
};

const getScheduledMessage = (publishAt, unpublishAt) => {
  let message = "";
  if (publishAt && unpublishAt) {
    message = `Publish schedule at ${formatDateToTimeDate(
      publishAt
    )} and unpublish schedule at ${formatDateToTimeDate(unpublishAt)}`;
  } else if (publishAt) {
    message = `Publish schedule at ${formatDateToTimeDate(publishAt)}`;
  } else if (unpublishAt) {
    message = `Unpublish schedule at ${formatDateToTimeDate(unpublishAt)}`;
  }

  return message;
};

export const buildArticleTableColumnData = (
  displayColumn,
  showDeleteAlert,
  handleEdit
) => {
  const columnData = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "20%",
      render: (title, { slug, status }) =>
        status === "Published" ? (
          <Link onClick={event => handleOpenEUI(event, slug)}>
            <Typography className="text-indigo-500" style="body2">
              {title}
            </Typography>
          </Link>
        ) : (
          <Typography style="body2">{title}</Typography>
        ),
    },
    {
      title: "Last Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "20%",
      render: (updatedAt, { status }) => (
        <Typography style="body2">
          {status === "Published" ? formatDateToMonthDateYear(updatedAt) : "-"}
        </Typography>
      ),
    },
    {
      title: "Author",
      dataIndex: "user",
      key: "user",
      width: "20%",
      render: user => (
        <Typography className="font-normal" style="body2">
          {user.name}
        </Typography>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: "20%",
      render: category => (
        <Typography className="font-normal" style="body2">
          {category.name}
        </Typography>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "14%",
      render: (status, { publishAt, unpublishAt }) => (
        <div className="flex items-center space-x-1">
          <Typography className="font-normal" style="body2">
            {status}
          </Typography>
          {(publishAt || unpublishAt) && (
            <TooltipWrapper
              content={getScheduledMessage(publishAt, unpublishAt)}
              disabled={publishAt || unpublishAt}
              position="bottom"
            >
              <Clock />
            </TooltipWrapper>
          )}
        </div>
      ),
    },
  ];

  const filteredColumnData = columnData.filter(
    column => displayColumn[column.dataIndex] === true
  );

  const icons = [
    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: "3%",
      render: id => (
        <Button
          className="text-sm font-normal"
          icon={Delete}
          style="text"
          onClick={event => showDeleteAlert(event, id)}
        />
      ),
    },
    {
      title: "",
      dataIndex: "id",
      key: "id",
      width: "3%",
      render: id => (
        <Button
          className="text-sm font-normal"
          icon={Edit}
          style="text"
          onClick={event => handleEdit(event, id)}
        />
      ),
    },
  ];

  return filteredColumnData.length > 0
    ? filteredColumnData.concat(icons)
    : filteredColumnData;
};

export const formatDateToMonthDateYear = dateTime =>
  dayjs(dateTime).format("MMMM Do, YYYY");

export const buildCategoryOptions = categories =>
  categories.map(category => ({
    label: category.name,
    value: category.id,
  }));

export const formatDateToTimeDate = dateTime =>
  dayjs(dateTime).format("hh:mmA, DD/MM/YYYY");
