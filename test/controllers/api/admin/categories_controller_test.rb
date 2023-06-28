# frozen_string_literal: true

require "test_helper"

class Api::Admin::CategoriesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
  end

  def test_should_show_all_categories
    get api_admin_categories_path
    assert_response :success
    response_json = response.parsed_body

    all_categories_count = response_json["categories"].count
    assert_equal @user.categories.count, all_categories_count
  end

  def test_should_create_category
    post api_admin_categories_path, params: { category: { name: "test-category", user: @user } }

    assert_response :success
    response_json = response.parsed_body
    assert_equal t("successfully_created", entity: Category), response_json["notice"]
  end

  def test_should_destroy_category
    assert_difference "@user.categories.count", -1 do
      delete api_admin_category_path(@category.id)
    end

    assert_response :success

    response_json = response.parsed_body
    assert_equal t("successfully_deleted", entity: "Category"), response_json["notice"]
  end

  def test_should_update_category
    put api_admin_category_path(@category.id), params: { category: { name: "Welcome to scribble" } }

    assert_response :success
    response_json = response.parsed_body
    assert_equal t("successfully_updated", entity: Category), response_json["notice"]
  end

  def test_should_reorder_category
    test_category = create(:category, user: @user)
    patch reorder_api_admin_category_path(@category.id), params: { destination: test_category.position }

    assert_response :success
    response_json = response.parsed_body
    assert_equal t("position_successfully_updated", entity: "Category"), response_json["notice"]
  end

  def test_shouldnt_create_category_with_existing_name
    post api_admin_categories_path, params: { category: { name: @category.name, user: @user } }
    assert_response :unprocessable_entity
  end

  def test_shouldnt_update_category_if_any_params_is_missing
    put api_admin_category_path(@category.id), params: { category: {} }

    assert_response :internal_server_error
  end

  def test_should_filter_categories_as_per_searched_category_name
    test_category_first = create(:category, name: "Apps & Integration", user: @user)
    test_category_second = create(:category, name: "Getting Started", user: @user)
    test_category_third = create(:category, name: "Software Development", user: @user)
    test_searched_name = "Development"

    get api_admin_categories_path, params: { searched_name: test_searched_name }

    assert_response :success
    response_json = response.parsed_body
    assert_equal @user.categories.where("lower(name) LIKE ?", "%#{test_searched_name.downcase}%").count,
      response_json.count
  end
end
