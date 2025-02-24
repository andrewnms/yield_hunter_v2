class YieldRate
  include Mongoid::Document
  include Mongoid::Timestamps

  field :bank_name, type: String
  field :account_type, type: String
  field :rate, type: Float
  field :last_updated, type: Time, default: -> { Time.current }

  validates :bank_name, presence: true
  validates :account_type, presence: true
  validates :rate, presence: true, numericality: { greater_than_or_equal_to: 0 }

  index({ bank_name: 1, account_type: 1 }, { unique: true })
end
