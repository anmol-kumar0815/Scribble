# frozen_string_literal: true

class ArticleUnpublishAtService
  attr_reader :article_id

  def initialize(article_id)
    @article_id = article_id
  end

  def process
    unpublish_article!
  end

  private

    def unpublish_article!
      article = Article.find(article_id)
      article.status = "Draft"
      article.unpublish_at = nil
      article.save!
    end
end
