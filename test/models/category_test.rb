# frozen_string_literal: true

require "test_helper"

class CreateCategoryTest < ActiveSupport::TestCase
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
  end

  def test_name_should_not_be_valid_and_saved_without_name
    @category.name = nil
    assert_not @category.valid?
    assert_includes @category.errors.full_messages, "Name can't be blank"
  end

  def test_name_should_be_of_valid_length
    @category.name = "a" * (Category::MAX_NAME_LENGTH + 1)
    assert_not @category.valid?
    assert_includes @category.errors.full_messages, "Name is too long (maximum is #{Category::MAX_NAME_LENGTH} characters)"
  end

  def test_name_should_be_unique
    test_category = @category.dup
    assert_not test_category.valid?
    assert_includes test_category.errors.full_messages, "Name has already been taken"
  end

  def test_category_shouldnt_be_create_without_user
    @category.user = nil
    assert_not @category.valid?
    assert_includes @category.errors.full_messages, "User must exist"
  end

  def test_should_set_position_before_create_category
    test_category = create(:category, user: @user)
    assert_equal Category.maximum(:position), test_category.position
  end

  def test_if_a_category_delete_then_all_article_under_that_should_also_delete
    previous_article_count_under_current_category = @category.articles.count

    Article.create!(
      title: "test-title", category: @category, body: "test-body", user: @user,
      status: "Published")

    current_article_count_under_current_category = @category.articles.count

    assert_equal previous_article_count_under_current_category + 1, current_article_count_under_current_category
    @category.destroy!
    assert_equal previous_article_count_under_current_category, @category.articles.count
  end
end
