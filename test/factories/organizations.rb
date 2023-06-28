# frozen_string_literal: true

FactoryBot.define do
  factory :organization do
    name { Faker::Name.name }
    password { "welcome123" }
    is_password_protected { false }
  end
end
