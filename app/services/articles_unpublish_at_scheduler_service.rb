# frozen_string_literal: true

class ArticlesUnpublishAtSchedulerService
  def process
    schedule_articles_to_be_unpublish_later
  end

  private

    def find_article_ids_having_unpublish_schedule
      Article.select { |article| (article.unpublish_at != nil and article.unpublish_at <= Time.zone.now) }.pluck(:id)
    end

    def schedule_articles_to_be_unpublish_later
      ids = find_article_ids_having_unpublish_schedule
      ids.each { |id|
        ArticleUnpublishAtWorker.perform_async(id)
      }
    end
end
