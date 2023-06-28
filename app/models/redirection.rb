# frozen_string_literal: true

class Redirection < ApplicationRecord
  validates :from, presence: true, uniqueness: true
  validates :to, presence: true
  validate :from_and_to_path_should_not_equal, :detect_cycle

  belongs_to :organization

  private

    def from_and_to_path_should_not_equal
      if self.to == self.from
        errors.add(:redirection, t("redirection.same_path"))
      end
    end

    def is_cycle(current_redirection)
      return true if current_redirection.to == self.from
      return false if !@_current_organization.redirections.where(from: current_redirection.to).present?

      is_cycle(@_current_organization.redirections.find_by!(from: current_redirection.to))
    end

    def detect_cycle
      current_organization!
      is_cycle_detected = false
      if @_current_organization.redirections.where(from: self.to).present?
        is_cycle_detected = is_cycle(@_current_organization.redirections.find_by!(from: self.to))
      end
      errors.add(:redirection, t("redirection.cycle")) if is_cycle_detected == true
    end

    def current_organization!
      @_current_organization ||= Organization.first
    end
end
