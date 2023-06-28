# frozen_string_literal: true

class Api::Admin::VisitsController < ApplicationController
  before_action :load_visit!, only: %i[update]

  def update
    if @visit.present?
      @visit[0].counts = @visit[0].counts + 1
      @visit[0].save!
      respond_with_success(t("successfully_updated", entity: Visit))
    else
      @article.visits.create!(counts: 1, date: visit_params[:date])
      respond_with_success(t("successfully_created", entity: Visit))
    end
    ArticleOrderByService.new(current_user, @category.id).process if @category.order_articles_by == "visits"
  end

  private

    def load_visit!
      @article = current_user.articles.find_by!(slug: params[:slug])
      @category = current_user.categories.find(@article.category_id)
      @visit = @article.visits.where(date: visit_params[:date])
    end

    def visit_params
      params.require(:visit).permit(:date)
    end
end
