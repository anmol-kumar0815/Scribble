# frozen_string_literal: true

json.versions @versions do | version |
  json.extract! version, :id, :object, :created_at
  if version.object != nil && version.object.has_key?("category_id") &&
     @_current_user.categories.where(id: version.object["category_id"]).present?
    json.category @_current_user.categories.find(version.object["category_id"])
  end
end
