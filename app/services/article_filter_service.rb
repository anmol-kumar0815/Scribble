# frozen_string_literal: true

class ArticleFilterService
  attr_reader :selected_category_ids, :selected_status, :searched_title
  attr_accessor :articles

  def initialize(articles, selected_category_ids, selected_status, searched_title)
    @articles = articles
    @selected_category_ids = selected_category_ids
    @selected_status = selected_status
    @searched_title = searched_title
  end

  def process
    self.articles = filter_by_selected_categories if selected_category_ids != nil && selected_category_ids.length() > 0
    self.articles = filter_by_selected_status if selected_status != nil && selected_status.length > 0 && selected_status != "All"
    self.articles = filter_by_searched_title if searched_title != nil && searched_title.length > 0
    self.articles = order_articles_by_updated_at

    articles
  end

  private

    def filter_by_selected_categories
      articles.where(category_id: selected_category_ids)
    end

    def filter_by_selected_status
      articles.where(status: selected_status)
    end

    def filter_by_searched_title
      articles.where("lower(title) LIKE ?", "%#{searched_title.strip.downcase}%")
    end

    def order_articles_by_updated_at
      articles.order("updated_at DESC")
    end
end
