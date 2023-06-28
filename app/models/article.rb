# frozen_string_literal: true

class Article < ApplicationRecord
  MAX_TITLE_LENGTH = 50
  MAX_PAGINATION_PER_PAGE = 10
  MAX_PAGINATION_ARTICLES_TABLE = 7

  acts_as_list scope: :category

  belongs_to :category
  belongs_to :user
  has_many :visits

  validates :title, presence: true, length: { maximum: MAX_TITLE_LENGTH }
  validates :body, presence: true
  validates :category_id, presence: true
  validate :slug_not_changed
  validate :datetime_should_not_be_in_past
  validate :schedule_and_current_status_must_be_different
  validate :schedules_time_must_be_different, if: -> { self.publish_at.present? && self.unpublish_at.present? }
  validate :dependent_schedule_time, if: -> { self.publish_at.present? && self.unpublish_at.present? }

  has_paper_trail on: %i[create update], only: %i[title category_id body status]
  max_paginates_per MAX_PAGINATION_PER_PAGE

  before_create :set_slug, if: -> { status == "Published" }
  before_update :set_slug, if: -> { slug.nil? && status == "Published" }

  private

    def set_slug
      title_slug = title.parameterize
      latest_article_slug = Article.where(
        "slug LIKE ? or slug LIKE ?",
        "#{title_slug}",
        "#{title_slug}-%"
      ).order("LENGTH(slug) DESC", slug: :desc).first&.slug
      slug_count = 0
      if latest_article_slug.present?
        slug_count = latest_article_slug.split("-").last.to_i
        only_one_slug_exists = slug_count == 0
        slug_count = 1 if only_one_slug_exists
      end
      slug_candidate = slug_count.positive? ? "#{title_slug}-#{slug_count + 1}" : title_slug
      self.slug = slug_candidate
    end

    def slug_not_changed
      if slug_changed? && self.persisted?
        errors.add(:slug, t("article.slug.immutable"))
      end
    end

    def dependent_schedule_time
      if (self.status == "Published") && (self.unpublish_at > self.publish_at)
        errors.add(:article, t("article.invalid_publish_datetime"))
      end
      if (self.status == "Draft") && (self.publish_at > self.unpublish_at)
        errors.add(:article, t("article.invalid_unpublish_datetime"))
      end
    end

    def datetime_should_not_be_in_past
      if self.publish_at.present? && self.publish_at.past?
        errors.add(:article, t("article.invalid_schedule_time"))
      end
      if self.unpublish_at.present? && self.unpublish_at.past?
        errors.add(:article, t("article.invalid_schedule_time"))
      end
    end

    def schedule_and_current_status_must_be_different
      if self.status == "Draft" && self.unpublish_at.present? && self.publish_at.nil?
        errors.add(:article, t("article.invalid_schedule"))
      end
      if self.status == "Published" && self.publish_at.present? && self.unpublish_at.nil?
        errors.add(:article, t("article.invalid_schedule"))
      end
    end

    def schedules_time_must_be_different
      if self.publish_at == self.unpublish_at
        errors.add(:article, t("article.schedule_time_cannot_be_same"))
      end
    end
end
