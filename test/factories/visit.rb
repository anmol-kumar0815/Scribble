# frozen_string_literal: true

FactoryBot.define do
  factory :visit do
    association :article, factory: :article
    date { Faker::Date.between(from: "2022-11-23", to: "2022-09-26") }
    counts { 0 }
  end
end
