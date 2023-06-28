# frozen_string_literal: true

require "test_helper"

class ArticleTest < ActiveSupport::TestCase
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_article_should_not_be_valid_without_title
    @article.title = nil
    assert_not @article.valid?
    assert_includes @article.errors.full_messages, "Title can't be blank"
  end

  def test_article_should_not_be_valid_without_body
    @article.body = nil
    assert_not @article.valid?
    assert_includes @article.errors.full_messages, "Body can't be blank"
  end

  def test_article_title_should_not_exceed_maximum_length
    @article.title = "a" * (Article::MAX_TITLE_LENGTH + 1)
    assert_not @article.valid?
    assert_includes @article.errors.full_messages, "Title is too long (maximum is #{Article::MAX_TITLE_LENGTH} characters)"
  end

  def test_article_should_not_be_valid_without_category
    @article.category = nil
    assert_not @article.valid?
    assert_includes @article.errors.full_messages, "Category can't be blank"
  end

  def test_article_should_not_be_valid_without_user
    @article.user = nil
    assert_not @article.valid?
    assert_includes @article.errors.full_messages, "User must exist"
  end

  def test_article_slug_is_parameterized_title
    title = @article.title
    @article.save!
    assert_equal title.parameterize, @article.slug
  end

  def test_slug_should_null_if_draft_article_is_created_for_the_first_time
    article = Article.create!(
      title: "dummy title", category: @category, body: @article.body, user: @user)
    assert_nil article.slug
  end

  def test_slug_should_set_when_article_will_be_publish_for_the_first_time
    article = Article.create!(
      title: "dummy title", category: @category, body: @article.body, user: @user)
    assert_nil article.slug

    article.status = "Published"
    article.save!
    assert_equal "dummy-title", article.slug
  end

  def test_slug_shouldnt_change_when_article_status_become_draft_after_being_publish
    article_slug = @article.slug
    @article.status = "Draft"
    @article.save!

    assert_not_nil @article.slug
    assert_equal article_slug, @article.slug
  end

  def test_incremental_slug_generation_for_article_with_duplicate_two_worded_titles
    first_article = Article.create!(
      title: "dummy title", category: @category, body: @article.body, user: @user,
      status: "Published")
    second_article = Article.create!(
      title: "dummy title", category: @category, body: @article.body, user: @user,
      status: "Published")

    assert_equal "dummy-title", first_article.slug
    assert_equal "dummy-title-2", second_article.slug
  end

  def test_incremental_slug_generation_for_article_with_duplicate_hyphenated_titles
    first_article = Article.create!(
      title: "dummy-title", category: @category, body: @article.body, user: @user,
      status: "Published")
    second_article = Article.create!(
      title: "dummy-title", category: @category, body: @article.body, user: @user,
      status: "Published")

    assert_equal "dummy-title", first_article.slug
    assert_equal "dummy-title-2", second_article.slug
  end

  def test_slug_generation_for_article_having_titles_one_being_prefix_of_the_other
    first_article = Article.create!(
      title: "out", category: @category, body: @article.body, user: @user,
      status: "Published")
    second_article = Article.create!(
      title: "outer", category: @category, body: @article.body, user: @user,
      status: "Published")

    assert_equal "out", first_article.slug
    assert_equal "outer", second_article.slug
  end

  def test_slug_suffix_is_maximum_slug_count_plus_one_if_two_or_more_slugs_already_exist
    title = "test-title"
    first_article = Article.create!(
      title: title, category: @category, body: @article.body, user: @user,
      status: "Published")
    second_article = Article.create!(
      title: title, category: @category, body: @article.body, user: @user,
      status: "Published")
    third_article = Article.create!(
      title: title, category: @category, body: @article.body, user: @user,
      status: "Published")

    assert_equal third_article.slug, "#{title.parameterize}-3"

    second_article.destroy

    expected_slug_suffix_for_new_article = third_article.slug.split("-").last.to_i + 1

    new_article = Article.create!(
      title: title, category: @category, body: @article.body, user: @user,
      status: "Published")
    assert_equal "#{title.parameterize}-#{expected_slug_suffix_for_new_article}", new_article.slug
  end

  def test_should_not_change_slug_after_publish
    test_article = create(:article, category: @category, user: @user, status: "Published")
    test_article.slug = "dummy-slug"
    assert_not test_article.valid?
  end

  def test_slug_should_be_nil_for_draft_article_for_first_time
    test_article = create(:article, category: @category, user: @user, status: "Draft")
    assert_nil test_article.slug
  end

  def test_article_schedule_datetime_should_not_be_in_past
    @article.unpublish_at = Time.zone.now - 1.second
    assert_not @article.valid?
    assert_includes @article.errors_to_sentence, t("article.invalid_schedule_time")

    @article.unpublish_at = nil
    @article.save!

    @article.publish_at = Time.zone.now - 1.second
    assert_not @article.valid?
    assert_includes @article.errors_to_sentence, t("article.invalid_schedule_time")
  end

  def test_article_schedules_time_must_be_different
    schedule_time = Time.zone.now + 1.hour
    @article.unpublish_at = schedule_time
    @article.save!

    @article.publish_at = schedule_time
    assert_not @article.valid?
    assert_includes @article.errors_to_sentence, t("article.schedule_time_cannot_be_same")
  end

  def test_published_article_dependent_schedules_must_have_time_as_per_their_dependency
    unpublish_schedule_time = Time.zone.now + 2.hour
    @article.unpublish_at = unpublish_schedule_time
    @article.save!

    @article.publish_at = unpublish_schedule_time - 30.minute
    assert_not @article.valid?
    assert_includes @article.errors_to_sentence, t("article.invalid_publish_datetime")
  end

  def test_draft_article_dependent_schedules_must_have_time_as_per_their_dependency
    @article.status = "Draft"
    @article.save!

    publish_schedule_time = Time.zone.now + 2.hour
    @article.publish_at = publish_schedule_time
    @article.save!

    @article.unpublish_at = publish_schedule_time - 30.minute
    assert_not @article.valid?
    assert_includes @article.errors_to_sentence, t("article.invalid_unpublish_datetime")
  end

  def test_article_schedule_and_current_state_must_be_different_if_it_has_no_other_schedule
    @article.publish_at = Time.zone.now + 1.hour
    assert_not @article.valid?
    assert_includes @article.errors_to_sentence, t("article.invalid_schedule")

    @article.publish_at = nil
    @article.status = "Draft"
    @article.save!

    @article.unpublish_at = Time.zone.now + 1.hour
    assert_not @article.valid?
    assert_includes @article.errors_to_sentence, t("article.invalid_schedule")
  end

  def test_should_allow_same_current_and_schedule_status_if_it_has_another_schedule
    @article.unpublish_at = Time.zone.now + 1.hour
    @article.save!
    @article.publish_at = Time.zone.now + 2.hour
    assert @article.valid?

    @article.unpublish_at = nil
    @article.status = "Draft"
    @article.save!

    @article.publish_at = Time.zone.now + 1.hour
    @article.save!
    @article.unpublish_at = Time.zone.now + 2.hour
    assert @article.valid?
  end
end
