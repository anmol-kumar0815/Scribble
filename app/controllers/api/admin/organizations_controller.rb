# frozen_string_literal: true

class Api::Admin::OrganizationsController < ApplicationController
  before_action :current_organization, only: %i[update show create]

  def show
    render
  end

  def create
    unless current_organization.authenticate(params[:password])
      respond_with_error(t("organization.invalid_password"), :unauthorized)
    end
  end

  def update
    current_organization.name = params[:name]
    if params[:is_password_protected] != nil
      current_organization.password = params[:password]
      current_organization.is_password_protected = params[:is_password_protected]
    end
    current_organization.save!
    respond_with_success(t("successfully_updated", entity: Organization))
  end
end
