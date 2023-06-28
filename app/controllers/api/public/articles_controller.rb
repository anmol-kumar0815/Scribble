# frozen_string_literal: true

class Api::Public::ArticlesController < ApplicationController
  before_action :authenticate_end_user_using_x_auth_token
  before_action :load_article!, only: %i[show]

  def index
    @articles = current_user.articles.where(status: "Published")
    render
  end

  def show
    render
  end

  private

    def load_article!
      @article = current_user.articles.find_by!(slug: params[:slug])
    end
end
