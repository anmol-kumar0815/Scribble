# frozen_string_literal: true

class AddPublishAtAndUnpublishAt < ActiveRecord::Migration[6.1]
  def change
    add_column :articles, :publish_at, :datetime
    add_column :articles, :unpublish_at, :datetime
  end
end
