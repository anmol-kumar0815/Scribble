# frozen_string_literal: true

json.articles @articles do | article |
  json.partial! "api/admin/articles/article", article: article
  json.extract! article, :publish_at, :unpublish_at
  json.user article.user, :id, :name
end

json.count @count
