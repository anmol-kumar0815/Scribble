# frozen_string_literal: true

require "test_helper"

class Api::Public::ArticlesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
    @category = create(:category, user: @user)
    @article = create(:article, category: @category, user: @user)
  end

  def test_should_show_published_articles
    test_article = create(:article, status: "Published", category: @category, user: @user)

    get api_public_articles_path
    assert_response :success
    response_json = response.parsed_body

    published_articles_count = response_json["articles"].count
    assert_equal @user.articles.where(status: "Published").count, published_articles_count
  end

  def test_should_show_article
    test_article = create(:article, status: "Published", category: @category, user: @user)

    get api_public_article_path(test_article.slug)

    assert_response :success
    response_json = response.parsed_body
    assert_equal test_article.title, response_json["title"]
  end

  def test_shouldnt_show_articles_if_user_is_unauthorized
    @organization.update!(is_password_protected: true)
    get api_public_articles_path

    assert_response :unauthorized
    response_json = response.parsed_body
    assert_equal t("organization.access_denied"), response_json["error"]
  end
end
