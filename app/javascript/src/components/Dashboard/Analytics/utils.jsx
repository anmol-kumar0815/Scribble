import React from "react";

import { Typography } from "neetoui";
import { Link } from "react-router-dom";

import { formatDateToMonthDateYear } from "../Articles/utils";

export const articlesColumnData = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: "35%",
    render: (title, { slug }) => (
      <Link target="_blank" to={`/public/${slug}`}>
        <Typography className="text-indigo-500" style="h5">
          {title}
        </Typography>
      </Link>
    ),
  },
  {
    title: "Date",
    dataIndex: "updatedAt",
    key: "updatedAt",
    width: "25%",
    render: updatedAt => (
      <Typography style="body2">
        {formatDateToMonthDateYear(updatedAt)}
      </Typography>
    ),
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    width: "25%",
    render: category => (
      <Typography className="font-normal" style="body2">
        {category.name}
      </Typography>
    ),
  },
  {
    title: "Visits",
    dataIndex: "visits",
    key: "visits",
    width: "15%",
    sorter: (a, b) => a.visits - b.visits,
    render: visits => (
      <Typography className="font-normal" style="body2">
        {visits}
      </Typography>
    ),
  },
];

export const articleVisitsColumnData = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: "35%",
    render: date => <Typography style="body2">{date}</Typography>,
  },
  {
    title: "Visits",
    dataIndex: "counts",
    key: "counts",
    width: "25%",
    render: count => <Typography style="body2">{count}</Typography>,
  },
];
