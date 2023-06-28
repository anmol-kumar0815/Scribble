# frozen_string_literal: true

module Authenticable
  extend ActiveSupport::Concern

  def authenticate_end_user_using_x_auth_token
    auth_token = request.headers["X-Auth-Token"]
    is_valid_token = (auth_token && ActiveSupport::SecurityUtils.secure_compare(
      current_organization.authentication_token,
      auth_token))

    if !is_valid_token && current_organization.is_password_protected
      respond_with_error(t("organization.access_denied"), :unauthorized)
    end
  end
end
