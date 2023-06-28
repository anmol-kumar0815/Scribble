import React, { useState } from "react";

import { Typography } from "neetoui";

import CurrentVersion from "./CurrentVersion";
import RestoreModal from "./RestoreModal";

import { formatDateToTimeDate } from "../utils";

const ShowHistory = ({ versions, article }) => {
  const [currentVersionId, setCurrentVersionId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = versionId => {
    setCurrentVersionId(versionId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentVersionId(null);
  };

  return (
    <>
      <CurrentVersion article={article} />
      <div className="h-screen overflow-y-scroll pb-48">
        {versions.length > 0 &&
          versions.map(version => (
            <div className="my-4" key={version.id}>
              <div className="border box-border flex rounded-sm px-4 py-2">
                <div className="w-3/4">
                  <Typography style="body3">
                    {formatDateToTimeDate(version.createdAt)}
                    <br />
                    {version.object.restored &&
                      `Restored from ${formatDateToTimeDate(
                        version.object.restoredFrom
                      )}`}
                  </Typography>
                </div>
                <div className="flex w-1/4 items-center">
                  <Typography
                    className="cursor-pointer text-indigo-600"
                    style="body3"
                    onClick={() => openModal(version.id)}
                  >
                    {version.object.restored
                      ? "Restored"
                      : version.object.status}
                  </Typography>
                </div>
              </div>
              {currentVersionId === version.id && (
                <RestoreModal
                  article={article}
                  closeModal={closeModal}
                  showModal={showModal}
                  version={version}
                />
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default ShowHistory;
