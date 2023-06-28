# frozen_string_literal: true

class Api::Admin::ArticlesController < ApplicationController
  before_action :load_article!, only: %i[update show reorder versions]

  def index
    @articles = ArticleFilterService.new(
      current_user.articles, params[:selected_category_ids], params[:selected_status],
      params[:searched_title]).process
    @count = @articles.count
    @articles = @articles.page(params[:page]).per(Article::MAX_PAGINATION_ARTICLES_TABLE)
    render
  end

  def create
    current_user.articles.create! article_params
    ArticleOrderBySetToNone.new(current_user, article_params[:category_id]).process
    respond_with_success(t("successfully_created", entity: Article))
  end

  def update
    @article.update! article_params
    ArticleOrderBySetToNone.new(current_user, @article.category_id).process
    respond_with_success(t("successfully_updated", entity: Article))
  end

  def show
    render
  end

  def move
    ArticleMoveService.new(
      current_user, params[:article_ids_that_need_to_be_move],
      params[:move_into_category_id]).process
    ArticleOrderBySetToNone.new(current_user, params[:move_into_category_id]).process
    respond_with_success(t("successfully_moved", entity: Article))
  end

  def reorder
    @article.insert_at(params[:destination].to_i)
    respond_with_success(t("position_successfully_updated", entity: Article))
  end

  def status_counts
    @articles = current_user.articles
    if params[:selected_category_ids].present?
      @articles = @articles.where(category_id: params[:selected_category_ids])
    end
    render
  end

  def published
    @articles = current_user.articles.where(status: "Published")
    @count = @articles.count
    @articles = @articles.page(params[:page])
    render
  end

  def versions
    @versions = @article.versions.reorder("created_at DESC")
    render
  end

  def bulk_delete
    ArticleBulkDeleteService.new(current_user, params[:ids]).process
    respond_with_success(t("successfully_deleted", entity: Article))
  end

  private

    def load_article!
      @article = current_user.articles.find(params[:id])
    end

    def article_params
      params.require(:article).permit(
        :title, :status, :category_id, :body, :restored, :restored_from, :publish_at,
        :unpublish_at)
    end
end
