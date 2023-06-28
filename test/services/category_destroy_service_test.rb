# frozen_string_literal: true

require "test_helper"

class CategoryDestroyServiceTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_shouldnt_destroy_last_category_named_as_general
    @category.name = "General"
    @category.save!
    CategoryDestroyService.new(@category, @user, { move_articles_into_category_id: "" }).process

    assert_equal 1, @user.categories.count
  end

  def test_should_destroy_category_if_it_has_no_article
    test_category = create(:category, user: @user)
    CategoryDestroyService.new(test_category, @user, { move_articles_into_category_id: "" }).process

    assert_not @user.categories.where(id: test_category.id).present?
  end

  def test_should_move_all_articles_to_general_if_it_is_last_category
    @category.name = "Started"
    @category.save!

    CategoryDestroyService.new(@category, @user, { move_articles_into_category_id: "" }).process

    assert_equal 1, @user.categories.count
    assert_equal "General", @user.categories.first.name
    assert_equal 1, @user.articles.count
  end

  def test_should_move_articles_into_an_existing_category_and_destroy_current_category
    first_test_category = create(:category, user: @user)
    second_test_category = create(:category, user: @user)
    first_test_article = create(:article, category: first_test_category, user: @user)
    first_test_category_articles_count = first_test_category.articles.count

    CategoryDestroyService.new(
      first_test_category, @user, second_test_category.id).process

    assert_not @user.categories.where(id: first_test_category.id).present?
    assert_equal first_test_category_articles_count, second_test_category.articles.count
  end
end
