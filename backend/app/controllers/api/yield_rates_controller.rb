class Api::YieldRatesController < ApplicationController
  def index
    @yield_rates = YieldRate.all
    render json: @yield_rates.map { |rate|
      {
        id: rate.id.to_s,
        bankName: rate.bank_name,
        accountType: rate.account_type,
        rate: rate.rate
      }
    }
  end
end
