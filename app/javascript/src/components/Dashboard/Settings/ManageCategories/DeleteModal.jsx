import React, { useState } from "react";

import { Warning } from "neetoicons";
import { Modal, Typography, Button, Callout, Select } from "neetoui";

import categoriesApi from "apis/admin/categories";

import { categoriesExceptSelectedCategory } from "./utils";

const DeleteModal = ({
  showModal,
  selectedCategory,
  setShowModal,
  categories,
  refetch,
}) => {
  const [moveArticlesToCategory, setMoveArticlesToCategory] = useState(null);

  const handleSubmit = async categoryId => {
    setShowModal(false);
    try {
      await categoriesApi.destroy(categoryId, { moveArticlesToCategory });
      refetch();
    } catch (error) {
      logger.error(error);
    }
  };

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Header>
        <Typography id="dialog1Title" style="h2">
          Delete Category
        </Typography>
      </Modal.Header>
      <Modal.Body className="space-y-2">
        {selectedCategory.count === 0 && (
          <Typography lineHeight="normal" style="body2">
            You are permanently deleting the&nbsp;
            <strong>{selectedCategory.name}</strong> category. This action
            cannot be undone. Are you sure you wish to continue?
          </Typography>
        )}
        {selectedCategory.count > 0 &&
          categories.length === 1 &&
          selectedCategory.name === "General" && (
            <Callout icon={Warning} style="danger">
              General category cannot be deleted, If you wish to delete it then
              first delete all articles of General category.
            </Callout>
          )}
        {selectedCategory.count > 0 && categories.length > 1 && (
          <>
            <Callout icon={Warning} style="danger">
              <div>
                Category <strong>{selectedCategory.name}</strong> has&nbsp;
                {selectedCategory.count}
                {selectedCategory.count > 1 ? " articles. " : " article. "}
                Before this category can be deleted, these&nbsp;
                {selectedCategory.count > 1 ? " articles " : " article "}
                &nbsp; needs to be moved to another category.
              </div>
            </Callout>
            <Select
              required
              label="Select a category to move these articles into"
              name="category"
              placeholder="Select Category"
              options={categoriesExceptSelectedCategory(
                categories,
                selectedCategory
              )}
              onChange={e => setMoveArticlesToCategory(e.value)}
            />
          </>
        )}
        {selectedCategory.count > 0 &&
          categories.length === 1 &&
          selectedCategory.name !== "General" && (
            <Callout icon={Warning} style="danger">
              <div>
                Category <strong>{selectedCategory.name}</strong> has&nbsp;
                <strong>{selectedCategory.count}</strong>
                <strong>
                  {selectedCategory.count > 1 ? " articles. " : " article. "}
                </strong>
                This will be moved to category general. Click proceed to
                continue.
              </div>
            </Callout>
          )}
      </Modal.Body>
      <Modal.Footer className="space-x-2">
        {!(
          selectedCategory.count > 0 &&
          categories.length === 1 &&
          selectedCategory.name === "General"
        ) && (
          <>
            <Button
              label="Proceed"
              style="danger"
              type="submit"
              disabled={
                selectedCategory.count > 0 &&
                categories.length > 1 &&
                !moveArticlesToCategory
              }
              onClick={() => handleSubmit(selectedCategory.id)}
            />
            <Button
              label="Cancel"
              style="text"
              onClick={() => setShowModal(false)}
            />
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
