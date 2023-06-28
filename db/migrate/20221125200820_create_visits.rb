# frozen_string_literal: true

class CreateVisits < ActiveRecord::Migration[6.1]
  def change
    create_table :visits do |t|
      t.date "date", null: false
      t.integer "counts", null: false, default: 0
      t.timestamps
    end
  end
end
