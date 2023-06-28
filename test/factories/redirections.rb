# frozen_string_literal: true

FactoryBot.define do
  factory :redirection do
    from { Faker::Internet.url(host: "example.com") }
    to { Faker::Internet.url(host: "example.com") }
  end
end
