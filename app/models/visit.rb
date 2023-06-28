# frozen_string_literal: true

class Visit < ApplicationRecord
  belongs_to :article

  validates :date, presence: true
  validates :article_id, presence: true
end
