# frozen_string_literal: true

require "test_helper"

class ArticleOrderByServiceTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
  end

  def test_should_order_articles_by_title
    test_category = create(:category, order_articles_by: "title", user: @user)
    test_articles = create_list(:article, 3, category: test_category, user: @user)

    ArticleOrderByService.new(@user, test_category.id).process

    expected_ordered_articles = @user.articles.where(category_id: test_category.id).order("lower(title)")
    actual_ordered_articles = @user.articles.where(category_id: test_category.id).order("position")

    assert_equal [expected_ordered_articles], [actual_ordered_articles]
  end

  def test_should_order_articles_by_visits
    test_category = create(:category, order_articles_by: "visits", user: @user)
    test_articles = create_list(:article, 3, category: test_category, user: @user)
    count = 1
    test_articles.each { |test_article|
      create(:visit, counts: count, article: test_article)
      count = count + 1
    }

    ArticleOrderByService.new(@user, test_category.id).process

    expected_ordered_articles = test_category.articles.sort_by { |article|
      article.visits.sum(:counts)
    }.reverse
    actual_ordered_articles = @user.articles.where(category_id: test_category.id).order("position")

    assert_equal [expected_ordered_articles], [actual_ordered_articles]
  end

  def test_should_order_articles_by_newly_modified
    test_category = create(:category, order_articles_by: "updated_at", user: @user)
    test_articles = create_list(:article, 3, category: test_category, user: @user)

    ArticleOrderByService.new(@user, test_category.id).process

    expected_ordered_articles = @user.articles.where(category_id: test_category.id).order("updated_at")
    actual_ordered_articles = @user.articles.where(category_id: test_category.id).order("position")

    assert_equal [expected_ordered_articles], [actual_ordered_articles]
  end

  def test_should_order_articles_by_created_date
    test_category = create(:category, order_articles_by: "created_at", user: @user)
    test_articles = create_list(:article, 3, category: test_category, user: @user)

    ArticleOrderByService.new(@user, test_category.id).process

    expected_ordered_articles = @user.articles.where(category_id: test_category.id).order("created_at")
    actual_ordered_articles = @user.articles.where(category_id: test_category.id).order("position")

    assert_equal [expected_ordered_articles], [actual_ordered_articles]
  end
end
