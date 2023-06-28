# frozen_string_literal: true

require "test_helper"

class Api::Admin::RedirectionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @redirection = create(:redirection, organization: @organization)
  end

  def test_should_show_all_redirection
    get api_admin_redirections_path
    assert_response :ok

    response_json = response.parsed_body
    assert_equal @organization.redirections.count, response_json["redirections"].count
  end

  def test_should_create_redirection
    post api_admin_redirections_path, params: { redirection: { from: "/abcd", to: "/abcde" } }
    assert_response :ok
    response_json = response.parsed_body
    assert_equal t("successfully_created", entity: Redirection), response_json["notice"]
  end

  def test_should_update_redirection
    redirection_params = { redirection: { from: "http://localhost:3000/about", to: "http://localhost:3000" } }
    put api_admin_redirection_path(@redirection.id), params: redirection_params
    assert_response :ok

    response_json = response.parsed_body
    assert_equal t("successfully_updated", entity: "Redirection"), response_json["notice"]
  end

  def test_should_destroy_redirection
    delete api_admin_redirection_path(@redirection.id)
    assert_response :ok

    response_json = response.parsed_body
    assert_equal t("successfully_deleted", entity: "Redirection"), response_json["notice"]
  end
end
