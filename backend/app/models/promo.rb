# frozen_string_literal: true

# Represents a promotional announcement in the system
# @attr [String] title The title of the promotion
# @attr [String] description Detailed description of the promotion
# @attr [String] bank The bank offering the promotion
# @attr [String] promo_type Type of promotion (info, success, warning)
# @attr [DateTime] valid_until Expiration date of the promotion
# @attr [String] cta_text Optional call-to-action text
# @attr [String] cta_url Optional call-to-action URL
# @attr [Boolean] active Whether the promotion is currently active
class Promo
  include Mongoid::Document
  include Mongoid::Timestamps

  # Fields
  field :title, type: String
  field :description, type: String
  field :bank, type: String
  field :promo_type, type: String, default: 'info'
  field :valid_until, type: DateTime
  field :cta_text, type: String
  field :cta_url, type: String
  field :active, type: Boolean, default: true

  # Validations
  validates :title, presence: { message: "Title cannot be blank" }
  validates :description, presence: { message: "Description cannot be blank" }
  validates :bank, presence: { message: "Please select a bank" }
  validates :valid_until, presence: { message: "Valid until date is required" }
  validates :promo_type, inclusion: { 
    in: %w[info success warning],
    message: "Type must be one of: info, success, warning" 
  }
  validate :valid_until_must_be_future

  # Scopes
  scope :active, -> { where(active: true) }
  scope :current, -> { active.where(:valid_until.gt => Time.current) }

  # Indexes
  index({ active: 1, valid_until: 1 })

  private

  # Validates that valid_until is a future date
  # This custom validation ensures that promotions cannot be created with past dates
  def valid_until_must_be_future
    return unless valid_until.present?
    
    # Compare dates in UTC to avoid timezone issues
    valid_until_date = valid_until.utc.to_date
    current_date = Time.current.utc.to_date
    
    if valid_until_date <= current_date
      errors.add(:valid_until, "must be a future date")
      Rails.logger.error "[Promo] Date validation failed: valid_until (#{valid_until_date}) <= current (#{current_date})"
    else
      Rails.logger.info "[Promo] Date validation passed: valid_until (#{valid_until_date}) > current (#{current_date})"
    end
  end
end
