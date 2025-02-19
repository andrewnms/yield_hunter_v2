module JwtAuthentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user
    
    private

    def authenticate_user
      Rails.logger.info "[JWT] Starting authentication"
      Rails.logger.info "[JWT] All cookies: #{cookies.to_h}"
      
      token = cookies[:jwt]
      Rails.logger.info "[JWT] Found token: #{token ? 'yes' : 'no'}"
      
      if token
        begin
          Rails.logger.info "[JWT] Attempting to decode token"
          decoded_token = JWT.decode(token, jwt_secret_key, true, { algorithm: 'HS256' })[0]
          Rails.logger.info "[JWT] Token decoded successfully: #{decoded_token}"
          
          @current_user = User.find(decoded_token['user_id'])
          Rails.logger.info "[JWT] User found: #{@current_user.email}"
        rescue JWT::ExpiredSignature
          Rails.logger.error "[JWT] Token has expired"
          cookies.delete(:jwt)
          render json: { error: 'Token has expired' }, status: :unauthorized
        rescue JWT::DecodeError => e
          Rails.logger.error "[JWT] Invalid token: #{e.message}"
          cookies.delete(:jwt)
          render json: { error: 'Invalid token' }, status: :unauthorized
        rescue Mongoid::Errors::DocumentNotFound => e
          Rails.logger.error "[JWT] User not found: #{e.message}"
          cookies.delete(:jwt)
          render json: { error: 'User not found' }, status: :unauthorized
        end
      else
        Rails.logger.error "[JWT] No token found in cookies"
        render json: { error: 'Token is missing' }, status: :unauthorized
      end
    end

    def current_user
      @current_user
    end

    def jwt_secret_key
      key = Rails.application.credentials.secret_key_base
      Rails.logger.info "[JWT] Using secret key: #{key[0..10]}..."
      key
    end
  end
end
