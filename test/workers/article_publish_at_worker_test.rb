# frozen_string_literal: true

require "test_helper"

class ArticlePublishAtWorkerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, status: "Draft", category: @category, user: @user)
  end

  def test_should_schedule_publish_later_and_publish_article
    schedule_time = Time.zone.now + 2.minute
    @article.publish_at = schedule_time
    @article.save!
    travel_to schedule_time
    ArticlePublishAtWorker.perform_async(@article.id)
    @article.reload

    assert_equal "Published", @article.status
    assert_nil @article.publish_at
  end
end
