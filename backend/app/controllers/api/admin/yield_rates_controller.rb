class Api::Admin::YieldRatesController < ApplicationController
  before_action :authenticate_user!
  before_action :ensure_admin!

  def index
    @yield_rates = YieldRate.all
    render json: @yield_rates.map { |rate|
      {
        id: rate.id.to_s,
        bankName: rate.bank_name,
        accountType: rate.account_type,
        rate: rate.rate,
        lastUpdated: rate.last_updated
      }
    }
  end

  def create
    @yield_rate = YieldRate.find_or_initialize_by(
      bank_name: params[:bankName],
      account_type: params[:accountType]
    )
    
    @yield_rate.rate = params[:rate]
    @yield_rate.last_updated = Time.current

    if @yield_rate.save
      render json: {
        id: @yield_rate.id.to_s,
        bankName: @yield_rate.bank_name,
        accountType: @yield_rate.account_type,
        rate: @yield_rate.rate,
        lastUpdated: @yield_rate.last_updated
      }, status: :ok
    else
      render json: { errors: @yield_rate.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def ensure_admin!
    unless current_user&.email == 'apagu.hxi@gmail.com'
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
end
