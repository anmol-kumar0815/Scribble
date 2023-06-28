# frozen_string_literal: true

class Api::Admin::UsersController < ApplicationController
  def show
    @user = current_user
    render
  end
end
