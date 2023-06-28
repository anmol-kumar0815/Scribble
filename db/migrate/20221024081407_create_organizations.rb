# frozen_string_literal: true

class CreateOrganizations < ActiveRecord::Migration[6.1]
  def change
    create_table :organizations do |t|
      t.string "name", null: false
      t.string "password_digest"
      t.string "authentication_token"
      t.timestamps
    end
  end
end
