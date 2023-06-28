# frozen_string_literal: true

require "test_helper"

class CategorySearchServiceTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
  end

  def test_should_search_uppercase_and_lowercase_name
    test_category = create(:category, name: "Getting Started", user: @user)
    filtered_categories = CategorySearchService.new(@user.categories, "GEttING").process

    assert_equal "Getting Started", filtered_categories[0].name
  end

  def test_should_ignore_white_spaces
    test_category = create(:category, user: @user)
    filtered_categories = CategorySearchService.new(@user.categories, "   ").process

    assert_equal @user.categories.count, filtered_categories.length
  end
end
