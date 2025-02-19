module JwtAuthentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_user
    
    private

    def authenticate_user
      token = cookies.signed[:jwt]
      
      if token
        begin
          decoded_token = JWT.decode(token, jwt_secret_key, true, algorithm: 'HS256')[0]
          @current_user = User.find(decoded_token['user_id'])
        rescue JWT::ExpiredSignature
          render json: { error: 'Token has expired' }, status: :unauthorized
        rescue JWT::DecodeError, Mongoid::Errors::DocumentNotFound
          render json: { error: 'Invalid token' }, status: :unauthorized
        end
      else
        render json: { error: 'Token is missing' }, status: :unauthorized
      end
    end

    def current_user
      @current_user
    end

    def jwt_secret_key
      Rails.application.credentials.jwt_secret_key || Rails.application.secrets.secret_key_base
    end
  end
end
