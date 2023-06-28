# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include ApiResponders
  include ApiRescuable
  include Authenticable

  private

    def current_organization
      @_current_organization ||= Organization.first
    end

    def current_user
      current_organization
      @_current_user ||= @_current_organization.users.first
    end
end
