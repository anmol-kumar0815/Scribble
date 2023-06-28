# frozen_string_literal: true

class ArticleBulkDeleteService
  attr_reader :current_user, :ids

  def initialize(current_user, ids)
    @current_user = current_user
    @ids = ids
  end

  def process
    remove_selected_articles_from_list!
    destroy_all_selected_articles
  end

  private

    def remove_selected_articles_from_list!
      ids.each { | id |
        current_user.articles.find(id).remove_from_list
      }
    end

    def destroy_all_selected_articles
      articles = current_user.articles.where(id: ids)
      articles.destroy_all
    end
end
