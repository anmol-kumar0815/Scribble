json.extract! @article, :title, :body, :updated_at
json.category @article.category, :id, :name
