# frozen_string_literal: true

class ArticleOrderBySetToNone
  attr_reader :current_user, :category_id

  def initialize(current_user, category_id)
    @current_user = current_user
    @category_id = category_id
  end

  def process
    set_order_by_to_none
  end

  private

    def set_order_by_to_none
      category = current_user.categories.find(category_id)
      category.order_articles_by = "none"
      category.save!
    end
end
