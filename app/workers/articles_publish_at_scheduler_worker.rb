# frozen_string_literal: true

class ArticlesPublishAtSchedulerWorker
  include Sidekiq::Worker

  def perform
    articles_publish_at_scheduler_service = ArticlesPublishAtSchedulerService.new
    articles_publish_at_scheduler_service.process
  end
end
