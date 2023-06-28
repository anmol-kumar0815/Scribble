import React from "react";

import { Accordion, Typography } from "neetoui";
import { NavLink, useRouteMatch } from "react-router-dom";

const SidebarMenu = ({
  activeArticleCategoryIndex,
  categories,
  setActiveSlug,
  setActiveArticleCategoryIndex,
}) => {
  const { url } = useRouteMatch();

  return (
    <Accordion
      className="border-r h-screen w-1/4 px-6"
      defaultActiveKey={activeArticleCategoryIndex}
    >
      {categories.map((category, index) => (
        <Accordion.Item
          className="text-gray-600"
          key={category.id}
          title={category.name}
        >
          {category.articles.map(article => (
            <NavLink
              exact
              activeClassName="neeto-ui-text-primary-500 mx-6"
              className="neeto-ui-text-gray-400 mx-6"
              key={article.id}
              to={`${url}/${article.slug}`}
              onClick={() => {
                setActiveSlug(article.slug);
                setActiveArticleCategoryIndex(index);
              }}
            >
              <Typography className="ml-4" style="body2">
                {article.title}
              </Typography>
            </NavLink>
          ))}
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default SidebarMenu;
