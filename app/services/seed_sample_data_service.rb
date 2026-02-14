# frozen_string_literal: true

require "yaml"
require "database_cleaner/active_record"

DatabaseCleaner.strategy = :truncation

class SeedSampleDataService
  BASE_PATH = Rails.root.join("db/seeds/sample_data")

  def process
    clean_database
    create_sample_organization
    create_sample_user
    create_categories_with_articles
  end

  private

    ############################################
    # Database cleanup
    ############################################

    def clean_database
      DatabaseCleaner.clean
    end

    ############################################
    # Organization & User
    ############################################

    def create_sample_organization
      @organization = Organization.create!(name: "Spinkart")
    end

    def create_sample_user
      @user = User.create!(
        name: "Oliver Smith",
        email: "oliver@example.com",
        organization: @organization
      )
    end

    ############################################
    # Categories & Articles from YAML
    ############################################

    def create_categories_with_articles
      categories.each do |category_name|
        category = @user.categories.create!(
          name: category_name
        )

        create_articles_for(category)
      end
    end

    def create_articles_for(category)
      articles_for(category.name).each do |article_data|
        @user.articles.create!(
          title: article_data.fetch("title"),
          body: article_data.fetch("body"),
          category: category,
          status: "Published",
          created_at: random_created_at,
          updated_at: random_updated_at
        )
      end
    end

    ############################################
    # YAML loaders
    ############################################

    def categories
      YAML.load_file(BASE_PATH.join("categories.yml"))
    end

    def articles_for(category_name)
      file_path = BASE_PATH.join("articles/#{category_name.downcase}.yml")

      unless File.exist?(file_path)
        raise "Missing seed file: #{file_path}"
      end

      YAML.load_file(file_path)
    end

    ############################################
    # Helpers
    ############################################

    def random_created_at
      rand(10..90).days.ago
    end

    def random_updated_at
      rand(1..9).days.ago
    end
end
