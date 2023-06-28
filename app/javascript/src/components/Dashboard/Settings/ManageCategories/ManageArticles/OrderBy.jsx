import React, { useRef } from "react";

import { Select } from "neetoui";

import TooltipWrapper from "common/TooltipWrapper";
import useUpdateCategory from "hooks/reactQuery/categories/useUpdate";

import { ORDER_BY_OPTIONS } from "../constant";

const OrderBy = ({ activeCategory, refetch }) => {
  const selectRef = useRef(null);

  const { mutate: updateCategory } = useUpdateCategory({
    onSuccess: () => refetch(),
    onError: error => logger.error(error),
  });

  const handleChangeOrderBy = orderBy => {
    selectRef.current.blur();
    if (orderBy === activeCategory.orderArticlesBy) return;

    const updatedOrderBy = {
      id: activeCategory.id,
      payload: { order_articles_by: orderBy },
    };
    updateCategory(updatedOrderBy);
  };

  return (
    <div className="w-4/12">
      <TooltipWrapper
        content="No article found in this category, Add some articles to order them."
        disabled={activeCategory.articles.length === 0}
      >
        <Select
          isSearchable
          innerRef={selectRef}
          isDisabled={activeCategory.articles.length === 0}
          key={Math.random()}
          name="OrderBy"
          options={ORDER_BY_OPTIONS}
          placeholder="Order Articles By"
          onChange={orderBy => handleChangeOrderBy(orderBy.value)}
        />
      </TooltipWrapper>
    </div>
  );
};

export default OrderBy;
