# frozen_string_literal: true

class Organization < ApplicationRecord
  MIN_PASSWORD_LENGTH = 6
  VALID_PASSWORD_REGEX = /([A-Za-z]+[0-9]|[0-9]+[A-Za-z])[A-Za-z0-9]*/.freeze

  has_many :users
  has_many :redirections

  validates :name, presence: true, uniqueness: true
  validates :password, length: { minimum: MIN_PASSWORD_LENGTH },
    format: {
      with: VALID_PASSWORD_REGEX,
      message: "Requires at least 1 letter and 1 digit"
    }, if: -> { password.present? }

  has_secure_password validations: false
  has_secure_token :authentication_token

  before_save :change_authentication_token, if: -> { password_digest_changed? }

  private

    def change_authentication_token
      self.authentication_token = SecureRandom.hex(10)
    end
end
