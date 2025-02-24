module Api
  class BankAccountsController < ApplicationController
    include JwtAuthentication
    before_action :set_bank_account, only: [:show, :update, :destroy, :projection]

    # GET /api/bank_accounts
    def index
      Rails.logger.info "[BankAccounts] Loading accounts for user: #{current_user.email}"
      @bank_accounts = current_user.bank_accounts
      
      # Sync yield rates before returning accounts
      @bank_accounts.each do |account|
        matching_rate = YieldRate.where(bank_name: account.bank_name).first
        if matching_rate && account.yield_rate != matching_rate.rate
          account.yield_rate = matching_rate.rate
          account.save!
        end
      end
      
      render json: @bank_accounts
    rescue => e
      Rails.logger.error "[BankAccounts] Error loading accounts: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: 'Error loading bank accounts' }, status: :internal_server_error
    end

    # GET /api/bank_accounts/:id
    def show
      render json: @bank_account
    end

    # POST /api/bank_accounts
    def create
      @bank_account = current_user.bank_accounts.build(bank_account_params)
      
      # Find the matching yield rate from admin-defined rates
      matching_rate = YieldRate.where(bank_name: @bank_account.bank_name).first
      @bank_account.yield_rate = matching_rate&.rate || 0.0

      if @bank_account.save
        render json: @bank_account, status: :created
      else
        render json: { errors: @bank_account.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /api/bank_accounts/:id
    def update
      # Find the matching yield rate from admin-defined rates
      matching_rate = YieldRate.where(bank_name: @bank_account.bank_name).first
      @bank_account.yield_rate = matching_rate&.rate || 0.0

      if @bank_account.update(bank_account_params)
        render json: @bank_account
      else
        render json: { errors: @bank_account.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/bank_accounts/:id
    def destroy
      @bank_account.destroy
      head :no_content
    end

    # GET /api/bank_accounts/:id/projection
    def projection
      days = (params[:days] || 40).to_i
      
      if days <= 0
        render json: { error: 'Days parameter must be positive' }, status: :bad_request
        return
      end

      projection_data = @bank_account.calculate_projection(days)
      render json: projection_data
    end

    private

    def set_bank_account
      @bank_account = current_user.bank_accounts.find(params[:id])
    rescue Mongoid::Errors::DocumentNotFound
      render json: { error: 'Bank account not found' }, status: :not_found
    end

    def bank_account_params
      params.require(:bank_account).permit(:name, :balance, :bank_name)
    end
  end
end
