# frozen_string_literal: true

require "test_helper"

class UserTest < ActiveSupport::TestCase
  def setup
    @organization = create(:organization)
    @user = create(:user, organization: @organization)
  end

  def test_user_should_not_be_valid_and_saved_without_name
    @user.name = nil
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Name can't be blank"
  end

  def test_name_should_be_of_valid_length
    @user.name = "a" * (User::MAX_NAME_LENGTH + 1)
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Name is too long (maximum is #{User::MAX_NAME_LENGTH} characters)"
  end

  def test_user_should_not_be_valid_and_saved_without_email
    @user.email = ""
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Email can't be blank"
  end

  def test_user_should_not_be_valid_and_saved_if_email_not_unique
    test_user = @user.dup
    assert_not test_user.valid?
    assert_includes test_user.errors.full_messages, "Email has already been taken"
  end

  def test_validation_should_accept_valid_addresses
    valid_emails = %w[user@example.com USER@example.COM US-ER@example.org
      first.last@example.in user+one@example.ac.in]

    valid_emails.each do |email|
      @user.email = email
      assert @user.valid?
    end
  end

  def test_validation_should_reject_invalid_addresses
    invalid_emails = %w[user@example,com user_at_example.org user.name@example.
      @sam-sam.com sam@sam+exam.com fishy+#.com]

    invalid_emails.each do |email|
      @user.email = email
      assert @user.invalid?
    end
  end

  def test_email_should_be_saved_in_lowercase
    test_user = build(:user, organization: @organization)
    test_user_upcase_email = test_user.email.upcase!
    test_user.email = test_user_upcase_email

    test_user.save!
    assert_equal test_user_upcase_email.downcase, test_user.email
  end

  def test_user_should_not_be_valid_and_saved_without_organization
    @user.organization = nil
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Organization must exist"
  end

  def test_when_a_user_is_deleted_all_categories_created_by_that_user_should_also_be_deleted
    previous_categories_count = @user.categories.count
    Category.create(name: "test-category", user: @user)

    assert_equal previous_categories_count + 1, @user.categories.count
    @user.destroy!
    assert_equal previous_categories_count, @user.categories.count
  end
end
