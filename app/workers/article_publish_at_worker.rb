# frozen_string_literal: true

class ArticlePublishAtWorker
  include Sidekiq::Worker

  def perform(article_id)
    ArticlePublishAtService.new(article_id).process
  end
end
