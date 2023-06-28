# frozen_string_literal: true

FactoryBot.define do
  factory :article do
    association :category, factory: :category
    association :user, factory: :user
    title { Faker::Lorem.sentence[0..14] }
    status { "Published" }
    body { Faker::Lorem.sentence[0..49] }
  end
end
