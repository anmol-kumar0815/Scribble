# frozen_string_literal: true

require "test_helper"

class Api::Admin::UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
  end

  def test_should_show_first_user_as_current_user
    test_user = create(:user, organization: @organization)
    get api_admin_user_path
    assert_response :success

    response_json = response.parsed_body
    assert_equal @organization.users.first.email, response_json["email"]
  end
end
