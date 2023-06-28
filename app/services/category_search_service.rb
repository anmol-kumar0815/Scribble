# frozen_string_literal: true

class CategorySearchService
  attr_reader :searched_name
  attr_accessor :categories

  def initialize(categories, searched_name)
    @categories = categories
    @searched_name = searched_name
  end

  def process
    self.categories = search_category_by_searched_name if searched_name != nil
    self.categories = order_categories_by_position

    categories
  end

  def search_category_by_searched_name
    categories.where("lower(name) LIKE ?", "%#{searched_name.strip.downcase}%")
  end

  def order_categories_by_position
    categories.order("position")
  end
end
