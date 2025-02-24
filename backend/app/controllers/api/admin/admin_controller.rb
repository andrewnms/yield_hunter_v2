module Api
  module Admin
    class AdminController < ApplicationController
      before_action :authenticate_admin!

      private

      def authenticate_admin!
        unless current_user&.admin?
          Rails.logger.warn "[Admin] Non-admin user attempted to access admin endpoint: #{current_user&.email}"
          render json: { error: 'Unauthorized - Admin access required' }, status: :unauthorized
        end
      end
    end
  end
end
