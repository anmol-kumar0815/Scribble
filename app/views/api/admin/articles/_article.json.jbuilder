# frozen_string_literal: true

json.extract! article,
  :id,
  :title,
  :body,
  :status,
  :category_id,
  :slug,
  :updated_at,
  :user_id

json.category article.category
