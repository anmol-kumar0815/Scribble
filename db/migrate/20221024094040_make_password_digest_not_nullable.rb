# frozen_string_literal: true

class MakePasswordDigestNotNullable < ActiveRecord::Migration[6.1]
  def change
    add_column :organizations, :is_password_protected, :boolean, default: false
    change_column_null :organizations, :password_digest, false
  end
end
