# frozen_string_literal: true

class ArticleMoveService
  attr_reader :current_user, :article_ids_that_need_to_be_move, :move_into_category_id

  def initialize(current_user, article_ids_that_need_to_be_move, move_into_category_id)
    @current_user = current_user
    @article_ids_that_need_to_be_move = article_ids_that_need_to_be_move
    @move_into_category_id = move_into_category_id
  end

  def process
    move_articles
  end

  private

    def remove_articles_from_existing_list
      article_ids_that_need_to_be_move.each { | article_id |
        current_user.articles.find(article_id).remove_from_list
      }
    end

    def move_articles
      remove_articles_from_existing_list
      current_user.articles.where(id: article_ids_that_need_to_be_move).update(category_id: move_into_category_id)
    end
end
