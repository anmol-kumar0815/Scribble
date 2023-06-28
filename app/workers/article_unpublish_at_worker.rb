# frozen_string_literal: true

class ArticleUnpublishAtWorker
  include Sidekiq::Worker

  def perform(article_id)
    ArticleUnpublishAtService.new(article_id).process
  end
end
