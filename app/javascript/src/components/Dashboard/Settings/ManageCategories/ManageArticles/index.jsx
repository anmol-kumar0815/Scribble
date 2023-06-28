import React, { useState, useEffect } from "react";

import ActionBlock from "./ActionBlock";
import Banner from "./Banner";
import List from "./List";

const ManageArticles = ({
  activeCategory,
  categories,
  setActiveCategory,
  refetch,
}) => {
  const [showBanner, setShowBanner] = useState(false);
  const [selectedArticleIds, setSelectedArticleIds] = useState([]);

  const checkForShowBanner = () => {
    const showBanner = JSON.parse(localStorage.getItem("showBanner"));
    showBanner === null || showBanner === true
      ? setShowBanner(true)
      : setShowBanner(false);
  };

  useEffect(() => {
    checkForShowBanner();
  }, []);

  useEffect(() => {
    setSelectedArticleIds([]);
  }, [activeCategory]);

  return (
    <div className="fixed right-0 w-2/4">
      <div className="mb-6 max-h-screen w-full overflow-y-scroll p-3">
        <ActionBlock
          activeCategory={activeCategory}
          categories={categories}
          refetch={refetch}
          selectedArticleIds={selectedArticleIds}
        />
        {showBanner && <Banner setShowBanner={setShowBanner} />}
        <List
          activeCategory={activeCategory}
          refetch={refetch}
          setActiveCategory={setActiveCategory}
          setSelectedArticleIds={setSelectedArticleIds}
        />
      </div>
      <br />
    </div>
  );
};

export default ManageArticles;
