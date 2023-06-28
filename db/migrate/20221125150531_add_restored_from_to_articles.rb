# frozen_string_literal: true

class AddRestoredFromToArticles < ActiveRecord::Migration[6.1]
  def change
    add_column :articles, :restored_from, :datetime
  end
end
