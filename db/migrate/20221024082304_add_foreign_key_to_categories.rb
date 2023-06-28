# frozen_string_literal: true

class AddForeignKeyToCategories < ActiveRecord::Migration[6.1]
  def change
    add_column :categories, :user_id, :integer
    change_column_null :categories, :user_id, false
    add_foreign_key :categories, :users, on_delete: :cascade
  end
end
