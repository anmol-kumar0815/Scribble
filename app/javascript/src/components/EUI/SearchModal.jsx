import React from "react";

import { Up, Down } from "neetoicons";
import { Modal, Select, Typography } from "neetoui";

const SearchModal = ({
  showSearchModal,
  setShowSearchModal,
  searchOptions,
  setActiveSlug,
}) => (
  <Modal
    closeButton={false}
    isOpen={showSearchModal}
    onClose={() => setShowSearchModal(false)}
  >
    <Modal.Header>
      <div className="flex items-end justify-evenly">
        <div className="flex space-x-2">
          <Down className="bg-gray-400" size={20} />
          <Up className="bg-gray-400" size={20} />
          <Typography style="body3">To Navigate</Typography>
        </div>
        <div className="flex space-x-2">
          <Typography className="bg-gray-400" style="body3">
            Return
          </Typography>
          <Typography style="body3">To Select</Typography>
        </div>
        <div className="flex space-x-2">
          <Typography className="bg-gray-400" style="body3">
            ESC
          </Typography>
          <Typography style="body3">To Close</Typography>
        </div>
      </div>
    </Modal.Header>
    <Modal.Body>
      <Select
        defaultMenuIsOpen
        options={searchOptions}
        placeholder="Search for articles here"
        onChange={article => {
          setShowSearchModal(false);
          setActiveSlug(article.value);
        }}
      />
    </Modal.Body>
    <Modal.Footer />
  </Modal>
);

export default SearchModal;
