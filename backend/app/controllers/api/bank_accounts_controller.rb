module Api
  class BankAccountsController < ApplicationController
    before_action :set_bank_account, only: [:show, :update, :destroy, :projection]

    # GET /api/bank_accounts
    def index
      @bank_accounts = BankAccount.all
      render json: @bank_accounts
    end

    # GET /api/bank_accounts/:id
    def show
      render json: @bank_account
    end

    # POST /api/bank_accounts
    def create
      @bank_account = BankAccount.new(bank_account_params)

      if @bank_account.save
        render json: @bank_account, status: :created
      else
        render json: { errors: @bank_account.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # PATCH/PUT /api/bank_accounts/:id
    def update
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
      @bank_account = BankAccount.find(params[:id])
    rescue Mongoid::Errors::DocumentNotFound
      render json: { error: 'Bank account not found' }, status: :not_found
    end

    def bank_account_params
      params.require(:bank_account).permit(:name, :balance, :yield_rate)
    end
  end
end
