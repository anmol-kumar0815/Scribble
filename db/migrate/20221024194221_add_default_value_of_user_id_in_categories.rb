# frozen_string_literal: true

class AddDefaultValueOfUserIdInCategories < ActiveRecord::Migration[6.1]
  def change
    change_column_default :categories, :user_id, 1
  end
end
