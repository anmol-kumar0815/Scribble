json.articles @articles do | article |
  json.extract! article,
  :id,
  :title,
  :body,
  :status,
  :category_id,
  :slug,
  :updated_at,
  :user_id

  json.category article.category.name
end
