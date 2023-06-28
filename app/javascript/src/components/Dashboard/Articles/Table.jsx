import React, { useState, useEffect } from "react";

import { Table as NeetoUITable, Alert, Typography } from "neetoui";
import { assoc } from "ramda";
import { useHistory } from "react-router-dom";

import articlesApi from "apis/admin/articles";
import Pagination from "common/Pagination";

import { buildArticleTableColumnData } from "./utils";

const Table = ({
  fetchArticlesCategoriesAndStatusCount,
  articles,
  displayColumn,
  totalArticlesCount,
  setFiltrationConstraints,
  filtrationConstraints,
}) => {
  const [paginationPageNumber, setPaginationPageNumber] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState(null);

  const history = useHistory();

  const paginationPageSize = 7;

  const showDeleteAlert = (event, id) => {
    event.stopPropagation();
    setShowAlert(true);
    setSelectedArticleId(id);
  };

  const updatePaginationPageNumber = pageNumber => {
    setPaginationPageNumber(pageNumber);
    setFiltrationConstraints(assoc("page", pageNumber));
  };

  const onLastPageDeletingLastArticle = () => {
    const totalPaginationPages = Math.ceil(
      totalArticlesCount / paginationPageSize
    );
    if (
      paginationPageNumber === totalPaginationPages &&
      articles.length === 1
    ) {
      return true;
    }

    return false;
  };

  const handleDelete = async () => {
    setShowAlert(false);
    try {
      await articlesApi.destroy({ ids: [selectedArticleId] });
      if (onLastPageDeletingLastArticle()) {
        setFiltrationConstraints(assoc("page", paginationPageNumber - 1));
        setPaginationPageNumber(prevValue => prevValue - 1);
      } else {
        fetchArticlesCategoriesAndStatusCount();
      }
    } catch (error) {
      logger.error(error);
    }
  };

  const handleEdit = (event, id) => {
    event.stopPropagation();
    history.push(`article/${id}/edit`);
  };

  useEffect(() => {
    setPaginationPageNumber(filtrationConstraints.page);
  }, [filtrationConstraints]);

  return (
    <div className="w-full">
      <Typography className="mt-6" style="h4">
        {`${articles.length} ${articles.length > 1 ? "Articles" : "Article"}`}
      </Typography>
      <NeetoUITable
        allowRowClick
        className="mt-6"
        rowData={articles}
        columnData={buildArticleTableColumnData(
          displayColumn,
          showDeleteAlert,
          handleEdit
        )}
        onRowClick={(event, record) => handleEdit(event, record.id)}
      />
      <Pagination
        count={totalArticlesCount}
        currentPageNumber={paginationPageNumber}
        pageSize={paginationPageSize}
        setCurrentPageNumber={updatePaginationPageNumber}
      />
      <Alert
        isOpen={showAlert}
        message="This cannot be undone."
        title="Are you sure you want to delete this article?"
        onClose={() => setShowAlert(false)}
        onSubmit={handleDelete}
      />
    </div>
  );
};

export default Table;
