# frozen_string_literal: true

require "yaml"
require "faker"
require "database_cleaner/active_record"

DatabaseCleaner.strategy = :truncation

class SeedSampleDataService
  def process
    clean_database
    create_sample_organization
    create_sample_user
    create_sample_categories
    create_sample_draft_articles
    create_sample_published_articles
  end

  private

    def clean_database
      DatabaseCleaner.clean
    end

    def create_sample_organization
      Organization.create!(
        name: "Spinkart",
      )
   end

    def create_sample_user
      current_organization = Organization.first
      User.create!(
        name: "Oliver Smith",
        email: "oliver@example.com",
        organization_id: current_organization.id,
      )
    end

    def create_sample_categories
      5.times do
        current_user.categories.create!(
          name: Faker::Lorem.word,
        )
      end
    end

    def create_sample_draft_articles
      current_user.categories.each do |category|
        3.times do
          current_user.articles.create!(
            title: Faker::Lorem.sentence[5..10],
            body: Faker::Lorem.sentence(word_count: rand(50..100)).chomp("."),
            category_id: category.id,
          )
        end
      end
    end

    def create_sample_published_articles
      current_user.categories.each do |category|
        5.times do
          current_user.articles.create!(
            title: Faker::Lorem.sentence[5..10],
            body: Faker::Lorem.sentence(word_count: rand(50..100)).chomp("."),
            category_id: category.id,
            status: "Published",
          )
        end
      end
    end

    def current_organization
      Organization.first
    end

    def current_user
      current_organization.users.first
    end
end
