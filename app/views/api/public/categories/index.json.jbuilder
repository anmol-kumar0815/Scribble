# frozen_string_literal: true

json.categories @categories do | category |
  if category.articles.where(status: "Published").count > 0
    json.extract! category, :id, :name, :user_id
    json.articles category.articles.where(status: "Published").order("position ASC"), :id, :slug, :title, :body,
    :updated_at, :status
  end
end
