# frozen_string_literal: true

require "test_helper"

class ArticleMoveServiceTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_should_move_articles_to_selected_category
    test_category = create(:category, user: @user)
    test_article = create(:article, category: @category, user: @user)
    ArticleMoveService.new(@user, [@article.id, test_article.id], test_category.id).process

    assert_equal 0, @category.articles.where(id: [@article.id, test_article.id]).count
    assert_equal 2, test_category.articles.where(id: [@article.id, test_article.id]).count
  end
end
