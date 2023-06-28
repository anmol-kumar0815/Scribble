# frozen_string_literal: true

require "test_helper"

class VisitTest < ActiveSupport::TestCase
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, status: "Published", category: @category, user: @user)
    @visit = create(:visit, article: @article)
  end

  def test_visit_should_not_be_valid_and_saved_without_date
    @visit.date = nil
    assert_not @visit.valid?
    assert_includes @visit.errors.full_messages, "Date can't be blank"
  end

  def test_visit_should_not_be_valid_and_saved_without_article_id
    @visit.article_id = nil
    assert_not @visit.valid?
    assert_includes @visit.errors.full_messages, "Article must exist"
  end
end
