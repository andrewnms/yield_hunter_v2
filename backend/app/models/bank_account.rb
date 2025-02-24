class BankAccount
  include Mongoid::Document
  include Mongoid::Timestamps

  # Fields
  field :name, type: String
  field :bank_name, type: String
  field :account_type, type: String
  field :balance, type: Float, default: 0.0
  field :yield_rate, type: Float, default: 0.0

  # Relations
  belongs_to :user

  # Validations
  validates :name, presence: true, uniqueness: { scope: :user_id }
  validates :bank_name, presence: true
  validates :account_type, presence: true
  validates :balance, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :yield_rate, presence: true, numericality: { 
    greater_than_or_equal_to: 0,
    less_than_or_equal_to: 100 # Maximum 100% yield rate
  }
  validates :user, presence: true

  # Callbacks
  before_validation :set_defaults
  before_validation :set_yield_rate

  # Financial calculation methods
  def calculate_projection(days = 40)
    return {
      current_balance: balance,
      projected_balance: calculate_projected_balance(days),
      yield_rate: yield_rate,
      days: days,
      annual_earnings: calculate_annual_earnings,
      projection_date: Time.current + days.days
    }
  end

  def calculate_projected_balance(days)
    return balance if yield_rate.zero?
    
    # Convert annual yield rate to daily rate
    daily_rate = yield_rate / (100 * 365)
    
    # Calculate compound interest for the given number of days
    projected = balance * (1 + daily_rate) ** days
    
    # Round to 2 decimal places for currency
    projected.round(2)
  end

  def calculate_annual_earnings
    return 0.0 if yield_rate.zero?
    
    projected_annual = calculate_projected_balance(365)
    (projected_annual - balance).round(2)
  end

  private

  def set_defaults
    self.balance ||= 0.0
    self.yield_rate ||= 0.0
  end

  def set_yield_rate
    return unless bank_name.present? && account_type.present?
    
    rate = YieldRate.where(
      bank_name: bank_name,
      account_type: account_type
    ).first

    self.yield_rate = rate&.rate || 0.0
  end
end
