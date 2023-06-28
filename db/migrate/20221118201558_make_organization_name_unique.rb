# frozen_string_literal: true

class MakeOrganizationNameUnique < ActiveRecord::Migration[6.1]
  def change
    add_index :organizations, :name, unique: true
  end
end
