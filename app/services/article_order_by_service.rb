# frozen_string_literal: true

class ArticleOrderByService
  attr_reader :current_user, :category_id

  def initialize(current_user, category_id)
    @current_user = current_user
    @category_id = category_id
  end

  def process
    return if category_has_order_by_as_none

    order_articles_of_current_category_as_per_selected_order
  end

  private

    def category_has_order_by_as_none
      category = current_user.categories.find(category_id)
      category.order_articles_by == "none"
    end

    def remove_articles_from_list(ids)
      ids.each { | id |
        current_user.articles.find(id).remove_from_list
      }
    end

    def get_ordered_articles(category)
      order_by = category.order_articles_by
      articles = nil
      if order_by == "visits"
        articles = category.articles.sort_by { |article|
          article.visits.sum(:counts)
        }.reverse
      elsif order_by == "title"
        articles = category.articles.order("lower(title)")
      else
        articles = category.articles.order(order_by)
      end
      articles
    end

    def order_articles(articles)
      position = 1
      articles.each { |article|
        current_user.articles.find(article.id).insert_at(position)
        position = position + 1
      }
    end

    def order_articles_of_current_category_as_per_selected_order
      category = current_user.categories.find(category_id)
      article_ids = category.articles.map { |article| article.id }
      remove_articles_from_list(article_ids)
      articles = get_ordered_articles(category)
      order_articles(articles)
    end
end
