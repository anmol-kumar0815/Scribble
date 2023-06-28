import React, { useState, useEffect } from "react";

import { Plus, Edit, Delete } from "neetoicons";
import { Typography, Button, PageLoader, Alert } from "neetoui";

import redirectionsApi from "apis/admin/redirections";

import Form from "./Form";

const Table = () => {
  const [loading, setLoading] = useState(true);
  const [showAddRedirection, setShowAddRedirection] = useState(false);
  const [redirectionLinks, setRedirectionLinks] = useState({});
  const [currentEditLinkId, setCurrentEditLinkId] = useState(null);
  const [currentDeleteLinkId, setCurrentDeleteLinkId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleDelete = async () => {
    setShowAlert(false);
    try {
      await redirectionsApi.destroy(currentDeleteLinkId);
      fetchRedirectionLinks();
    } catch (error) {
      logger.error(error);
    }
  };

  const fetchRedirectionLinks = async () => {
    try {
      const {
        data: { redirections },
      } = await redirectionsApi.list();

      setRedirectionLinks(redirections);
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const closeFormOnEscape = () => {
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        setShowAddRedirection(false);
        setCurrentEditLinkId(null);
      }
    });
  };

  useEffect(() => {
    fetchRedirectionLinks();
    closeFormOnEscape();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <Typography className="ml-4 text-gray-500" style="body3">
          FROM PATH
        </Typography>
        <Typography className="text-gray-500" style="body3">
          TO PATH
        </Typography>
        <Typography className="mr-6 text-gray-500" style="body3">
          ACTIONS
        </Typography>
      </div>
      <div className="mt-4 w-full">
        {redirectionLinks.map(link => {
          if (link.id === currentEditLinkId) {
            return (
              <Form
                isEdit
                initialValues={link}
                key={link.id}
                refetch={fetchRedirectionLinks}
                setCurrentEditLinkId={setCurrentEditLinkId}
                setShowAddRedirection={setShowAddRedirection}
              />
            );
          }

          return (
            <div
              className="mt-2 flex w-full items-center justify-between bg-white p-4"
              key={link.from}
            >
              <div className="w-5/12 overflow-x-auto">
                <Typography>
                  {window.location.origin}
                  {link.from}
                </Typography>
              </div>
              <div className="w-5/12 overflow-x-auto">
                <Typography>
                  {window.location.origin}
                  {link.to}
                </Typography>
              </div>
              <div className="">
                <Button
                  icon={Delete}
                  style="text"
                  onClick={() => {
                    setShowAlert(true);
                    setCurrentDeleteLinkId(link.id);
                  }}
                />
                <Button
                  icon={Edit}
                  style="text"
                  onClick={() => setCurrentEditLinkId(link.id)}
                />
              </div>
            </div>
          );
        })}
        <Alert
          isOpen={showAlert}
          message="This cannot be undone."
          title="Are you sure you want to delete this redirection link?"
          onClose={() => setShowAlert(false)}
          onSubmit={() => handleDelete()}
        />
        {showAddRedirection && (
          <Form
            initialValues={{ from: "", to: "" }}
            isEdit={false}
            refetch={fetchRedirectionLinks}
            setCurrentEditLinkId={setCurrentEditLinkId}
            setShowAddRedirection={setShowAddRedirection}
          />
        )}
        <Button
          className="mt-2"
          icon={Plus}
          iconPosition="left"
          label="Add new redirections"
          style="link"
          onClick={() => setShowAddRedirection(preValue => !preValue)}
        />
      </div>
    </div>
  );
};

export default Table;
