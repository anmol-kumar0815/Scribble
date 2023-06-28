# frozen_string_literal: true

class AddRestoredToArticle < ActiveRecord::Migration[6.1]
  def change
    add_column :articles, :restored, :boolean, default: false
  end
end
