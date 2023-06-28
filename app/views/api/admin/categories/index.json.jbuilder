# frozen_string_literal: true

json.categories @categories do | category |
  json.extract! category, :id, :name, :user_id, :order_articles_by
  json.count category.articles.count
  json.drafted_article_count category.articles.where(status: "Draft").count
  json.published_article_count category.articles.where(status: "Published").count
  json.articles category.articles.order("position ASC"), :id, :slug, :title, :body, :updated_at, :status
end
