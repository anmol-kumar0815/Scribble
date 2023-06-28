import React, { useState, useEffect } from "react";

import { Checkbox, Avatar, Typography, Tag } from "neetoui";
import { without, append } from "ramda";
import { Draggable } from "react-beautiful-dnd";

import TooltipWrapper from "common/TooltipWrapper";
import { allKeysToCamelCase } from "components/utils";

import { calculateCreatedAgo, dateInLongFormat } from "../utils";

const Show = ({ article, setSelectedArticleIds, index, activeCategory }) => {
  const [isChecked, setIsChecked] = useState(false);

  article = allKeysToCamelCase(article);

  const handleCheckboxValueChange = currentArticle => {
    setIsChecked(prevValue => !prevValue);
    if (isChecked) {
      setSelectedArticleIds(without([currentArticle.id]));
    } else {
      setSelectedArticleIds(append(currentArticle.id));
    }
  };

  useEffect(() => {
    setIsChecked(false);
  }, [activeCategory]);

  return (
    <Draggable
      draggableId={article.id.toString()}
      index={index}
      key={article.id}
    >
      {provided => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="border border-black-200 drop-shadow-md my-2 box-border w-full border-solid p-2"
        >
          <Checkbox
            checked={isChecked}
            onChange={() => handleCheckboxValueChange(article)}
          />
          <Typography className="my-2" style="h5">
            {article.title}
          </Typography>
          <Typography className="truncate my-2" style="body3">
            {article.body}
          </Typography>
          <hr className="my-2" />
          <div className="flex w-full justify-end">
            <TooltipWrapper
              disabled
              position="bottom"
              content={`${dateInLongFormat(
                article.updatedAt
              )} (${calculateCreatedAgo(article.updatedAt)})`}
            >
              <Typography className="mx-1 mt-2" style="body3">
                {article.status === "Published" ? "Published " : "Drafted "}
                {calculateCreatedAgo(article.updatedAt)}
              </Typography>
            </TooltipWrapper>
            <Avatar
              className="mx-1"
              size="medium"
              user={{
                name: "Oliver Smith",
              }}
            />
            <Tag
              label={article.status}
              style={article.status === "Published" ? "success" : "info"}
              type="solid"
            />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Show;
