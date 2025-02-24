module Api
  module Admin
    class YieldRatesController < ApplicationController
      before_action :ensure_admin!
      rescue_from Mongoid::Errors::Validations, with: :handle_validation_error
      rescue_from Mongoid::Errors::DocumentNotFound, with: :handle_not_found

      # GET /api/admin/yield-rates
      # Returns a list of all yield rates
      # @return [Array<YieldRate>] List of yield rates
      def index
        Rails.logger.info "[YieldRates] Fetching all yield rates"
        @yield_rates = YieldRate.all.order(bank_name: :asc)
        render json: @yield_rates
      rescue StandardError => e
        Rails.logger.error "[YieldRates] Error fetching yield rates: #{e.message}"
        render json: { error: 'Failed to fetch yield rates' }, status: :internal_server_error
      end

      # POST /api/admin/yield-rates
      # Creates or updates a yield rate for a bank
      # @param bank_name [String] Name of the bank
      # @param rate [Float] Interest rate percentage
      # @return [YieldRate] Created or updated yield rate
      def create
        Rails.logger.info "[YieldRates] Creating/updating yield rate for bank: #{yield_rate_params[:bank_name]}"
        
        # Find existing rate for the bank or create new one
        @yield_rate = YieldRate.find_or_initialize_by(bank_name: yield_rate_params[:bank_name])
        @yield_rate.rate = yield_rate_params[:rate]
        @yield_rate.last_updated = Time.current

        if @yield_rate.save
          Rails.logger.info "[YieldRates] Successfully saved yield rate for #{@yield_rate.bank_name}"
          render json: @yield_rate, status: @yield_rate.previously_new_record? ? :created : :ok
        else
          Rails.logger.error "[YieldRates] Failed to save yield rate: #{@yield_rate.errors.full_messages.join(', ')}"
          render json: { errors: @yield_rate.errors.full_messages }, status: :unprocessable_entity
        end
      rescue StandardError => e
        Rails.logger.error "[YieldRates] Error saving yield rate: #{e.message}"
        render json: { error: 'Failed to save yield rate' }, status: :internal_server_error
      end

      private

      def yield_rate_params
        params.require(:yield_rate).permit(:bank_name, :rate)
      end

      def ensure_admin!
        unless current_user&.email == 'apagu.hxi@gmail.com'
          Rails.logger.warn "[YieldRates] Unauthorized access attempt by #{current_user&.email}"
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end

      def handle_validation_error(error)
        Rails.logger.error "[YieldRates] Validation error: #{error.message}"
        render json: { errors: error.document.errors.full_messages }, status: :unprocessable_entity
      end

      def handle_not_found(error)
        Rails.logger.error "[YieldRates] Record not found: #{error.message}"
        render json: { error: 'Yield rate not found' }, status: :not_found
      end
    end
  end
end
