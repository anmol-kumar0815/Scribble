# frozen_string_literal: true

class MakeFromAndToNotNullable < ActiveRecord::Migration[6.1]
  def change
    change_column_null :redirections, :from, false
    change_column_null :redirections, :to, false
  end
end
