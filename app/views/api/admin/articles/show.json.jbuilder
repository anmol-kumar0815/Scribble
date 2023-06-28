# frozen_string_literal: true

json.partial! "api/admin/articles/article", article: @article
json.extract! @article, :restored, :restored_from, :publish_at, :unpublish_at
