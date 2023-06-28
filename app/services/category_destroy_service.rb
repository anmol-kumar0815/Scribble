# frozen_string_literal: true

class CategoryDestroyService
  attr_reader :category, :current_user, :move_articles_into_category_id

  def initialize(category, current_user, move_articles_into_category_id)
    @category = category
    @current_user = current_user
    @move_articles_into_category_id = move_articles_into_category_id
  end

  def process
    if category_does_not_have_any_article?
      destroy_category
    elsif destroying_last_category_named_as_general?
      nil
    elsif one_category_left_which_is_not_general?
      create_general_category_then_move_articles_in_that_and_destroy_current_category
    elsif more_than_one_category_left_and_current_category_has_some_article?
      move_articles_into_an_existing_category_and_destroy_current_category
    end
  end

  private

    def destroying_last_category_named_as_general?
      current_user.categories.count == 1 && category.name == "General"
    end

    def category_does_not_have_any_article?
      current_user.articles.where(category_id: category.id).count == 0
    end

    def one_category_left_which_is_not_general?
      current_user.categories.count == 1 && category.name != "General"
    end

    def more_than_one_category_left_and_current_category_has_some_article?
      current_user.categories.count >= 1 && current_user.articles.where(category_id: category.id).count > 0
    end

    def destroy_category
      category.destroy!
    end

    def move_articles_into_an_existing_category_and_destroy_current_category
      move_articles_into(move_articles_into_category_id)
      destroy_category
    end

    def create_general_category_then_move_articles_in_that_and_destroy_current_category
      general_category = current_user.categories.create!({ name: "General" })
      move_articles_into(general_category.id)
      destroy_category
    end

    def move_articles_into(new_category_id)
      articles = current_user.articles.where(category_id: category.id)
      remove_articles_from_existing_list(articles)
      articles.update(category_id: new_category_id)
    end

    def remove_articles_from_existing_list(articles)
      articles.each { | article |
        current_user.articles.find(article.id).remove_from_list
      }
    end
end
