# frozen_string_literal: true

class ArticlesPublishAtSchedulerService
  def process
    schedule_articles_to_be_publish_later
  end

  private

    def find_article_ids_having_publish_schedule
      Article.select { |article| (article.publish_at != nil and article.publish_at <= Time.zone.now) }.pluck(:id)
    end

    def schedule_articles_to_be_publish_later
      ids = find_article_ids_having_publish_schedule
      ids.each { |id|
        ArticlePublishAtWorker.perform_async(id)
      }
    end
end
