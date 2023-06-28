# frozen_string_literal: true

class Api::Admin::CategoriesController < ApplicationController
  before_action :load_category!, only: %i[update destroy reorder]

  def index
    @categories = CategorySearchService.new(current_user.categories, params[:searched_name]).process
    render
  end

  def create
    category = current_user.categories.create! category_params
    respond_with_success(t("successfully_created", entity: Category))
  end

  def update
    @category.update! category_params
    ArticleOrderByService.new(current_user, @category.id).process if category_params.has_key?("order_articles_by")
    respond_with_success(t("successfully_updated", entity: Category))
  end

  def destroy
    CategoryDestroyService.new(@category, current_user, params[:move_articles_into_category_id]).process
    respond_with_success(t("successfully_deleted", entity: Category))
  end

  def reorder
    @category.insert_at(params[:destination].to_i)
    respond_with_success(t("position_successfully_updated", entity: Category))
  end

  private

    def load_category!
      @category = current_user.categories.find(params[:id])
    end

    def category_params
      params.require(:category).permit(:name, :position, :order_articles_by)
    end
end
