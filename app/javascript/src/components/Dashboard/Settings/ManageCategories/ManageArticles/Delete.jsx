import React, { useState } from "react";

import { Delete as DeleteIcon } from "neetoicons";
import { Button, Alert } from "neetoui";

import TooltipWrapper from "common/TooltipWrapper";
import useDeleteArticles from "hooks/reactQuery/articles/useDelete";

const Delete = ({ selectedArticleIds, refetch }) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const { mutate: deleteArticles } = useDeleteArticles({
    onSuccess: () => refetch(),
    onError: error => logger.error(error),
  });

  const handleDelete = () => {
    setShowDeleteAlert(false);
    deleteArticles(selectedArticleIds);
  };

  return (
    <>
      <TooltipWrapper
        content="Select some articles"
        disabled={selectedArticleIds.length === 0}
      >
        <Button
          disabled={selectedArticleIds.length === 0}
          icon={DeleteIcon}
          style="danger-text"
          onClick={() => setShowDeleteAlert(true)}
        />
      </TooltipWrapper>
      <Alert
        isOpen={showDeleteAlert}
        title={`Deleting ${selectedArticleIds.length} ${
          selectedArticleIds.length > 1 ? " Articles" : " Article"
        }`}
        onClose={() => setShowDeleteAlert(false)}
        onSubmit={() => handleDelete()}
      />
    </>
  );
};

export default Delete;
