# frozen_string_literal: true

class AddOrderArticlesByToCategory < ActiveRecord::Migration[6.1]
  def change
    add_column :categories, :order_articles_by, :string, default: "none", null: false
  end
end
