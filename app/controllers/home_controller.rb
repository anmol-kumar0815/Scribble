# frozen_string_literal: true

class HomeController < ApplicationController
  before_action :redirection, only: %i[index]

  def index
    render
  end

  private

    def redirection
      current_requested_path = request.path
      redirect_to_path = current_organization.redirections.find_by(from: current_requested_path)
      redirect_to redirect_to_path.to if redirect_to_path != nil
    end
end
