# frozen_string_literal: true

require "test_helper"

class ArticleFilterServiceTest < ActiveSupport::TestCase
  def setup
    @user = create(:user)
    @selected_category_ids = [1, 2]
    @searched_term = "  ruby on rails  "
  end

  def test_process_builds_filters_with_all_options
    expected_results = [build(:article)]

    Article.expects(:search).with(
      "ruby on rails",
      where: {
        user_id: @user.id,
        category_id: @selected_category_ids,
        status: "Published"
      },
      order: { updated_at: :desc }
    ).returns(expected_results)

    result = ArticleFilterService.new(
      @user.id,
      @selected_category_ids,
      "Published",
      @searched_term
    ).process

    assert_equal expected_results, result
  end

  def test_process_uses_wildcard_when_search_term_blank
    expected_results = []

    Article.expects(:search).with(
      "*",
      where: { user_id: @user.id },
      order: { updated_at: :desc }
    ).returns(expected_results)

    result = ArticleFilterService.new(@user.id, [], "All", "   ").process

    assert_equal expected_results, result
  end

  def test_process_does_not_include_status_filter_when_all_is_selected
    Article.expects(:search).with(
      "hello",
      where: { user_id: @user.id, category_id: @selected_category_ids },
      order: { updated_at: :desc }
    ).returns([])

    ArticleFilterService.new(@user.id, @selected_category_ids, "All", "hello").process
  end

  def test_process_does_not_include_category_filter_when_no_categories_selected
    Article.expects(:search).with(
      "hello",
      where: { user_id: @user.id, status: "Draft" },
      order: { updated_at: :desc }
    ).returns([])

    ArticleFilterService.new(@user.id, nil, "Draft", "hello").process
  end
end
