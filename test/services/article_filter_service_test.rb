# frozen_string_literal: true

require "test_helper"

class ArticleFilterServiceTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_should_filter_article_by_selected_status
    first_test_article = create(:article, category: @category, user: @user)
    second_test_article = create(:article, category: @category, user: @user)
    filtered_articles = ArticleFilterService.new(@user.articles, [], "Draft", "").process

    assert_equal @user.articles.where(status: "Draft").count, filtered_articles.count
  end

  def test_should_filter_article_by_searched_title
    first_test_article = create(:article, title: "dummy", category: @category, user: @user)
    second_test_article = create(:article, title: "test", category: @category, user: @user)
    filtered_articles = ArticleFilterService.new(@user.articles, [], "All", "dum").process

    assert_equal [first_test_article], filtered_articles
  end

  def test_should_filter_article_by_selected_category_ids
    test_category = create(:category, user: @user)
    first_test_article = create(:article, category: @category, user: @user)
    second_test_article = create(:article, category: test_category, user: @user)
    filtered_articles = ArticleFilterService.new(@user.articles, [test_category.id], "All", "").process

    assert_equal [second_test_article], filtered_articles
  end
end
