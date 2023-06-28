# frozen_string_literal: true

require "test_helper"

class Api::Public::CategoriesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
  end

  def test_should_show_categories_who_are_having_published_articles
    test_article = create(:article, status: "Published", category: @category, user: @user)

    get api_public_categories_path
    assert_response :ok
    response_json = response.parsed_body

    categories_count = response_json["categories"].count
    assert_equal @user.categories.count, categories_count
  end
end
