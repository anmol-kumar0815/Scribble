import React, { useEffect, useState } from "react";

import { Formik, Form as FormikForm } from "formik";
import { Button, Modal, Typography, PageLoader, Callout } from "neetoui";
import { Input, Textarea } from "neetoui/formik";
import { useHistory } from "react-router-dom";

import articlesApi from "apis/admin/articles";
import TooltipWrapper from "common/TooltipWrapper";

const RestoreModal = ({ showModal, version, article, closeModal }) => {
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({});

  const history = useHistory();

  const formatFormInitialValues = () => {
    const initialValues = {
      title: version.object["title"],
      category:
        "category" in version ? version.category.name : "Category was deleted.",
      body: version.object["body"],
    };
    setInitialValues(initialValues);
  };
  const handleSubmit = async () => {
    closeModal();
    const formValues = {
      title: initialValues.title,
      body: initialValues.body,
      status: "Draft",
      category_id: initialValues.category.id,
      restored: true,
      restored_from: version.createdAt,
      publish_at: null,
      unpublish_at: null,
    };
    try {
      await articlesApi.update(article.id, { article: formValues });
      history.go(0);
    } catch (error) {
      logger.error(error);
    }
  };

  useEffect(() => {
    formatFormInitialValues();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="h-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <Modal isOpen={showModal} onClose={() => closeModal()}>
      <Modal.Header>
        <Typography style="h2">Version History</Typography>
        <Typography className="text-gray-600" style="body2">
          Version history of {article.title}.
        </Typography>
      </Modal.Header>
      <Modal.Body className="space-y-4">
        {(article.publishAt || article.unpublishAt) && (
          <Callout style="info">
            <Typography style="body3">
              Current version of "{article.title}" article is having
              publish/unpublish later schedule, After restoring this version
              publish/unpublish later schedule will be cancelled
            </Typography>
          </Callout>
        )}
        <Formik initialValues={initialValues}>
          <FormikForm>
            <TooltipWrapper
              disabled
              content="Cannot edit article details, You can only restore it."
            >
              <div className="flex gap-x-4">
                <Input
                  disabled
                  className="w-7/12"
                  label="Article Title"
                  name="title"
                />
                <Input disabled label="Category" name="category" />
              </div>
            </TooltipWrapper>
            <TooltipWrapper
              disabled
              content="Cannot edit article details, You can only restore it."
            >
              <Textarea
                disabled
                className="mt-5"
                label="Article Body"
                name="body"
                rows={10}
              />
            </TooltipWrapper>
          </FormikForm>
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex space-x-2">
          <TooltipWrapper
            disabled={version.object.restored || !("category" in version)}
            content={
              version.object.restored
                ? "This Version was already restored. Cannot restore it again."
                : "This category was deleted, Cannot restore this version."
            }
          >
            <Button
              disabled={version.object.restored || !("category" in version)}
              label="Restore Version"
              onClick={() => handleSubmit()}
            />
          </TooltipWrapper>
          <Button label="Cancel" style="text" onClick={() => closeModal()} />
        </div>
        <Typography className="mt-4" style="body3">
          Note: Article will be restored as draft.
        </Typography>
      </Modal.Footer>
    </Modal>
  );
};

export default RestoreModal;
