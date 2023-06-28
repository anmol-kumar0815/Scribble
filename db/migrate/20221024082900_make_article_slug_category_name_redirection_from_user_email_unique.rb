# frozen_string_literal: true

class MakeArticleSlugCategoryNameRedirectionFromUserEmailUnique < ActiveRecord::Migration[6.1]
  def change
    add_index :articles, :slug, unique: true
    add_index :categories, :name, unique: true
    add_index :redirections, :from, unique: true
    add_index :users, :email, unique: true
  end
end
