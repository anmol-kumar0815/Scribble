# frozen_string_literal: true

require "test_helper"

class Api::Admin::ArticlesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_should_list_all_articles
    get api_admin_articles_path
    assert_response :ok
    response_json = response.parsed_body

    all_articles_count = response_json["articles"].count
    assert_equal @user.articles.count, all_articles_count
  end

  def test_should_create_article
    post api_admin_articles_path,
      params: { article: { title: "Test Title", category_id: @category.id, user_id: @user.id, body: @article.body } }
    assert_response :ok
    response_json = response.parsed_body
    assert_equal t("successfully_created", entity: Article), response_json["notice"]
  end

  def test_user_can_update_any_article_field
    put api_admin_article_path(@article.id), params: { article: { title: "Welcome to scribble" } }

    assert_response :success
    response_json = response.parsed_body
    assert_equal t("successfully_updated", entity: Article), response_json["notice"]
  end

  def test_should_show_article
    get api_admin_article_path(@article.id)
    assert_response :success

    response_json = response.parsed_body
    assert_equal @article.id, response_json["id"]
  end

  def test_should_destroy_article
    assert_difference "@user.articles.count", -1 do
      post bulk_delete_api_admin_articles_path, params: { ids: [@article.id] }
    end

    assert_response :success
    response_json = response.parsed_body
    assert_equal t("successfully_deleted", entity: "Article"), response_json["notice"]
  end

  def test_should_destroy_articles
    test_article = create(:article, category: @category, user: @user)
    assert_difference "@user.articles.count", -2 do
      post bulk_delete_api_admin_articles_path, params: { ids: [@article.id, test_article.id] }
    end

    assert_response :success
    response_json = response.parsed_body
    assert_equal t("successfully_deleted", entity: "Article"), response_json["notice"]
  end

  def test_should_move_articles
    new_category = create(:category, user: @user)
    test_article = create(:article, category: @category, user: @user)
    patch move_api_admin_articles_path,
      params: {
        article_ids_that_need_to_be_move: [@article.id, test_article.id],
        move_into_category_id: new_category.id
      }

    assert_response :success
    response_json = response.parsed_body
    assert_equal t("successfully_moved", entity: "Article"), response_json["notice"]
  end

  def test_should_reorder_article
    test_article = create(:article, category: @category, user: @user)
    patch reorder_api_admin_article_path(@article.id), params: { destination: test_article.position }

    assert_response :success
    response_json = response.parsed_body
    assert_equal t("position_successfully_updated", entity: "Article"), response_json["notice"]
  end

  def test_should_list_all_articles_status_counts
    test_category = create(:category, user: @user)
    first_test_article = create(:article, category: test_category, user: @user)
    second_test_article = create(:article, category: @category, user: @user)

    get status_counts_api_admin_articles_path, params: { selected_category_ids: [test_category.id, @category.id] }
    assert_response :success
    response_json = response.parsed_body

    total_count = test_category.articles.count + @category.articles.count
    assert_equal total_count, response_json["all"]
  end

  def test_shouldnt_show_article_with_that_id_which_is_not_exist
    test_article = create(:article, category: @category, user: @user)
    test_article.destroy!

    get api_admin_article_path(test_article.id)
    assert_response :not_found
  end

  def test_should_show_all_puhblished_articles
    get published_api_admin_articles_path
    assert_response :success
    response_json = response.parsed_body

    published_articles_count = @user.articles.where(status: "Published").count
    assert_equal published_articles_count, response_json["articles"].count
  end

  def test_should_get_versions_of_an_article
    put api_admin_article_path(@article.id), params: { article: { title: "Welcome to scribble" } }
    assert_response :success

    get versions_api_admin_article_path(@article.id)

    assert_response :success
    response_json = response.parsed_body

    assert_equal 2, response_json["versions"].count
  end
end
