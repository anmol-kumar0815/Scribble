# frozen_string_literal: true

class AddForeignKeyToArticles < ActiveRecord::Migration[6.1]
  def change
    add_column :articles, :category_id, :integer
    change_column_null :articles, :category_id, false
    add_foreign_key :articles, :categories, on_delete: :cascade
  end
end
