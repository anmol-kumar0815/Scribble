# frozen_string_literal: true

require "test_helper"

class ArticleBulkDeleteServiceTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_should_delete_single_article
    ArticleBulkDeleteService.new(@user, [@article.id]).process

    assert_equal 0, @user.articles.where(id: @article.id).count
  end

  def test_should_delete_all_selected_articles
    test_article = create(:article, category: @category, user: @user)
    ArticleBulkDeleteService.new(@user, [@article.id, test_article.id]).process

    assert_equal 0, @user.articles.where(id: [@article.id, test_article.id]).count
  end
end
