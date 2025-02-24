class Promo
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title, type: String
  field :description, type: String
  field :bank, type: String
  field :promo_type, type: String, default: 'info' # info, success, warning
  field :valid_until, type: DateTime
  field :cta_text, type: String
  field :cta_url, type: String
  field :active, type: Boolean, default: true

  validates :title, presence: true
  validates :description, presence: true
  validates :valid_until, presence: true
  validates :promo_type, inclusion: { in: %w[info success warning] }

  scope :active, -> { where(active: true) }
  scope :current, -> { active.where(:valid_until.gt => Time.current) }

  index({ active: 1, valid_until: 1 })
end
