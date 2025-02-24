class YieldRate
  include Mongoid::Document
  include Mongoid::Timestamps

  field :bank_name, type: String
  field :rate, type: Float
  field :last_updated, type: Time, default: -> { Time.current }

  validates :bank_name, presence: true
  validates :rate, presence: true, numericality: { greater_than_or_equal_to: 0 }

  index({ bank_name: 1 }, { unique: true })

  after_save :update_associated_bank_accounts

  private

  def update_associated_bank_accounts
    Rails.logger.info "[YieldRate] Updating bank accounts for #{bank_name} with new rate: #{rate}"
    BankAccount.where(bank_name: bank_name).each do |account|
      # Force update and save the account to trigger callbacks
      account.yield_rate = rate
      account.save!
    end
  rescue => e
    Rails.logger.error "[YieldRate] Error updating bank accounts: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
  end
end
