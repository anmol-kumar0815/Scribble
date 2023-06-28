# frozen_string_literal: true

class AddForeignKeyToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :organization_id, :integer
    change_column_null :users, :organization_id, false
    add_foreign_key :users, :organizations, on_delete: :cascade
  end
end
