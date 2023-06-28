# frozen_string_literal: true

class AddForeignKeyToVisitsCount < ActiveRecord::Migration[6.1]
  def change
    add_column :visits, :article_id, :integer
    change_column_null :visits, :article_id, false
    add_foreign_key :visits, :articles, on_delete: :cascade
  end
end
