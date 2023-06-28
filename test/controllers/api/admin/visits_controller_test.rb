# frozen_string_literal: true

require "test_helper"
require "date"

class Api::Admin::VisitsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, status: "Published", category: @category, user: @user)
    @visit = create(:visit, article: @article)
  end

  def test_should_add_visit_count_by_date_if_date_not_exist_else_just_update_count
    date = DateTime.now.strftime("%Y/%m/%d")
    put api_admin_visit_path(@article.slug), params: { visit: { date: date } }

    assert_response :success
    response_json = response.parsed_body
    assert_equal t("successfully_created", entity: Visit), response_json["notice"]
    assert_equal 1, @article.visits.where(date: date)[0].counts

    put api_admin_visit_path(@article.slug), params: { visit: { date: date } }

    assert_response :success
    response_json = response.parsed_body
    assert_equal t("successfully_updated", entity: Visit), response_json["notice"]
    assert_equal 2, @article.visits.where(date: date)[0].counts
  end
end
