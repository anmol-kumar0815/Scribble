# frozen_string_literal: true

class ArticlesUnpublishAtSchedulerWorker
  include Sidekiq::Worker

  def perform
    articles_unpublish_at_scheduler_service = ArticlesUnpublishAtSchedulerService.new
    articles_unpublish_at_scheduler_service.process
  end
end
