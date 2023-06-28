# frozen_string_literal: true

require "test_helper"

class ArticleOrderBySetToNoneTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, order_articles_by: "title", user: @user)
  end

  def test_should_set_order_articles_by_to_none
    ArticleOrderBySetToNone.new(@user, @category.id).process

    @category.reload
    assert_equal "none", @category.order_articles_by
  end
end
