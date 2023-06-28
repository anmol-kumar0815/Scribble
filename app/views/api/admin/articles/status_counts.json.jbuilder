# frozen_string_literal: true

json.all @articles.count
json.published @articles.where(status: "Published").count
json.draft @articles.where(status: "Draft").count
