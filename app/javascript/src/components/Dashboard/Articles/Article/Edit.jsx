import React, { useState, useEffect } from "react";

import { PageLoader } from "neetoui";
import { useParams } from "react-router-dom";

import articlesApi from "apis/admin/articles";

import Form from "./Form";
import VersionHistory from "./VersionHistory";

export const Edit = () => {
  const [loading, setLoading] = useState(true);
  const [initialFormData, setInitialFormData] = useState({});

  const { id } = useParams();

  const fetchArticleDataUsingId = async () => {
    try {
      const {
        data: {
          title,
          body,
          status,
          category_id,
          category,
          updated_at,
          restored,
          restored_from,
          publish_at,
          unpublish_at,
        },
      } = await articlesApi.show(id);
      const initailFormData = {
        id,
        title,
        body,
        status,
        category: { label: category.name, value: category_id },
        updatedAt: updated_at,
        restored,
        restoredFrom: restored_from,
        publishAt: publish_at,
        unpublishAt: unpublish_at,
      };
      setInitialFormData(initailFormData);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticleDataUsingId();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="fixed flex w-full">
      <div className="mx-auto h-screen w-9/12 max-w-screen-sm py-6">
        <Form
          isEdit
          id={id}
          initailFormValue={initialFormData}
          setInitialFormValue={setInitialFormData}
        />
      </div>
      <div className="border-l w-3/12 p-4 pb-20">
        <VersionHistory article={initialFormData} />
      </div>
    </div>
  );
};

export default Edit;
