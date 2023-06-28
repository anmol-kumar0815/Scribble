# frozen_string_literal: true

class ArticlePublishAtService
  attr_reader :article_id

  def initialize(article_id)
    @article_id = article_id
  end

  def process
    publish_article!
  end

  private

    def publish_article!
      article = Article.find(article_id)
      article.status = "Published"
      article.publish_at = nil
      article.save!
    end
end
