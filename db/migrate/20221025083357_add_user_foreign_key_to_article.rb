# frozen_string_literal: true

class AddUserForeignKeyToArticle < ActiveRecord::Migration[6.1]
  def change
    add_foreign_key :articles, :users
  end
end
