# frozen_string_literal: true

require "test_helper"

class ArticleFilterServiceTest < ActiveSupport::TestCase
  def setup
    Searchkick.enable_callbacks

    @user = create(:user)
    @other_user = create(:user)
    @selected_category = create(:category, user: @user)
    @other_category = create(:category, user: @user)
  end

  def teardown
    Searchkick.disable_callbacks
  end

  def test_search_finds_article_by_title
    matching_article = create(
      :article,
      user: @user,
      category: @selected_category,
      title: "Ruby Testing Guide",
      body: "Completely unrelated body"
    )
    create(
      :article,
      user: @user,
      category: @selected_category,
      title: "JavaScript Tips",
      body: "Also unrelated"
    )

    Article.search_index.refresh

    filtered_articles = ArticleFilterService.new(@user.id, [], "All", "ruby").process.to_a

    assert_equal [matching_article.id], filtered_articles.map(&:id)
  end

  def test_search_finds_article_by_body
    matching_article = create(
      :article,
      user: @user,
      category: @selected_category,
      title: "Unrelated title",
      body: "This article explains OpenSearch analyzers"
    )
    create(
      :article,
      user: @user,
      category: @selected_category,
      title: "Another title",
      body: "No matching content here"
    )

    Article.search_index.refresh

    filtered_articles = ArticleFilterService.new(@user.id, [], "All", "analyzers").process.to_a

    assert_equal [matching_article.id], filtered_articles.map(&:id)
  end

  def test_search_respects_category_and_status_filters
    matching_article = create(
      :article,
      user: @user,
      category: @selected_category,
      status: "Published",
      title: "Filter test title",
      body: "Filter test body"
    )
    create(
      :article,
      user: @user,
      category: @other_category,
      status: "Published",
      title: "Filter test title",
      body: "Filter test body"
    )
    create(
      :article,
      user: @user,
      category: @selected_category,
      status: "Draft",
      title: "Filter test title",
      body: "Filter test body"
    )

    Article.search_index.refresh

    filtered_articles = ArticleFilterService.new(
      @user.id,
      [@selected_category.id],
      "Published",
      "filter"
    ).process.to_a

    assert_equal [matching_article.id], filtered_articles.map(&:id)
  end

  def test_search_limits_results_to_given_user
    create(
      :article,
      user: @other_user,
      category: create(:category, user: @other_user),
      title: "Ruby Secrets",
      body: "Should not be visible to another user"
    )
    matching_article = create(
      :article,
      user: @user,
      category: @selected_category,
      title: "Ruby Secrets",
      body: "Visible for current user"
    )

    Article.search_index.refresh

    filtered_articles = ArticleFilterService.new(@user.id, [], "All", "ruby").process.to_a

    assert_equal [matching_article.id], filtered_articles.map(&:id)
  end

  def test_blank_search_term_returns_all_articles_for_user_with_filters
    matching_published_article = create(
      :article,
      user: @user,
      category: @selected_category,
      status: "Published"
    )
    create(
      :article,
      user: @user,
      category: @selected_category,
      status: "Draft"
    )

    Article.search_index.refresh

    filtered_articles = ArticleFilterService.new(
      @user.id,
      [@selected_category.id],
      "Published",
      "   "
    ).process.to_a

    assert_equal [matching_published_article.id], filtered_articles.map(&:id)
  end
end
