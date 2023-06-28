# frozen_string_literal: true

require "test_helper"

class Api::Admin::OrganizationsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
  end

  def test_should_access_with_valid_credentials
    post api_admin_organization_path, params: { password: @organization.password }
    assert_response :ok

    assert_equal @organization.authentication_token, response.parsed_body["authentication_token"]
  end

  def test_should_show_organization_details
    get api_admin_organization_path
    assert_response :success

    response_json = response.parsed_body
    assert_equal @organization.id, response_json["organization"]["id"]
  end

  def test_shouldnt_access_with_invalid_credentials
    post api_admin_organization_path, params: { password: "invalid password" }
    assert_response :unauthorized

    response_json = response.parsed_body
    assert_equal t("organization.invalid_password"), response_json["error"]
  end

  def test_should_update_organization_details
    put api_admin_organization_path, params: { name: "DummyKart", password: "welcome123", is_password_protected: true }
    assert_response :success

    response_json = response.parsed_body
    assert_equal t("successfully_updated", entity: "Organization"), response_json["notice"]
  end
end
