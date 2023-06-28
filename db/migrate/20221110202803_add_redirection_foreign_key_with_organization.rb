# frozen_string_literal: true

class AddRedirectionForeignKeyWithOrganization < ActiveRecord::Migration[6.1]
  def change
    add_column :redirections, :organization_id, :integer
    change_column_null :redirections, :organization_id, false
    add_foreign_key :redirections, :organizations, on_delete: :cascade
  end
end
