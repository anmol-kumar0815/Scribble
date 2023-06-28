# frozen_string_literal: true

require "test_helper"

class ArticleUnpublishAtWorkerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_should_schedule_unpublish_later_and_unpublish_article
    schedule_time = Time.zone.now + 2.minute
    @article.unpublish_at = schedule_time
    @article.save!
    travel_to schedule_time
    ArticleUnpublishAtWorker.perform_async(@article.id)
    @article.reload

    assert_equal "Draft", @article.status
    assert_nil @article.unpublish_at
  end
end
