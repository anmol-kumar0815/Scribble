# frozen_string_literal: true

require "test_helper"

class OrganizationTest < ActiveSupport::TestCase
  def setup
    @organization = create(:organization)
  end

  def test_name_shouldnt_be_empty
    @organization.name = nil
    assert_not @organization.valid?
    assert_includes @organization.errors.full_messages, "Name can't be blank"
  end

  def test_name_should_be_unique
    test_organization = build(:organization, name: @organization.name)
    assert_not test_organization.valid?
    assert_includes test_organization.errors.full_messages, "Name has already been taken"
  end

  def test_password_should_have_at_least_6_character
    @organization.password = "welco"
    assert @organization.invalid?
    assert_includes @organization.errors.full_messages, "Password is too short (minimum is #{Organization::MIN_PASSWORD_LENGTH} characters)"
  end

  def test_password_should_have_at_least_one_digit
    @organization.password = "welcome"
    assert @organization.invalid?
    assert_includes @organization.errors.full_messages, "Password Requires at least 1 letter and 1 digit"
  end

  def test_password_should_have_at_least_one_letter
    @organization.password = "123456"
    assert @organization.invalid?
    assert_includes @organization.errors.full_messages, "Password Requires at least 1 letter and 1 digit"
  end
end
