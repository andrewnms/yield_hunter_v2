module Api
  class BankAccountsController < ApplicationController
    include JwtAuthentication
    before_action :set_bank_account, only: [:show, :update, :destroy, :projection]

    # GET /api/bank_accounts
    def index
      Rails.logger.info "[BankAccounts] Loading accounts for user: #{current_user.email}"
      @bank_accounts = current_user.bank_accounts
      render json: @bank_accounts.map { |account|
        {
          id: account.id.to_s,
          name: account.name,
          bankName: account.bank_name,
          accountType: account.account_type,
          balance: account.balance,
          yieldRate: account.yield_rate,
          createdAt: account.created_at,
          updatedAt: account.updated_at
        }
      }
    rescue => e
      Rails.logger.error "[BankAccounts] Error loading accounts: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: 'Error loading bank accounts' }, status: :internal_server_error
    end

    # GET /api/bank_accounts/:id
    def show
      render json: {
        id: @bank_account.id.to_s,
        name: @bank_account.name,
        bankName: @bank_account.bank_name,
        accountType: @bank_account.account_type,
        balance: @bank_account.balance,
        yieldRate: @bank_account.yield_rate,
        createdAt: @bank_account.created_at,
        updatedAt: @bank_account.updated_at
      }
    end

    # POST /api/bank_accounts
    def create
      @bank_account = current_user.bank_accounts.build(bank_account_params)

      if @bank_account.save
        render json: {
          id: @bank_account.id.to_s,
          name: @bank_account.name,
          bankName: @bank_account.bank_name,
          accountType: @bank_account.account_type,
          balance: @bank_account.balance,
          yieldRate: @bank_account.yield_rate,
          createdAt: @bank_account.created_at,
          updatedAt: @bank_account.updated_at
        }, status: :created
      else
        render json: { errors: @bank_account.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /api/bank_accounts/:id
    def update
      if @bank_account.update(bank_account_params)
        render json: {
          id: @bank_account.id.to_s,
          name: @bank_account.name,
          bankName: @bank_account.bank_name,
          accountType: @bank_account.account_type,
          balance: @bank_account.balance,
          yieldRate: @bank_account.yield_rate,
          createdAt: @bank_account.created_at,
          updatedAt: @bank_account.updated_at
        }
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
      params.require(:bank_account).permit(:name, :balance, :bank_name, :account_type, :yield_rate)
    end
  end
end
