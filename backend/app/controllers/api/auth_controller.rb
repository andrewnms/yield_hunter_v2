module Api
  class AuthController < ApplicationController
    skip_before_action :authenticate_user, only: [:register, :login]

    def register
      Rails.logger.info "[Auth] Registration attempt for email: #{params[:user][:email]}"
      user = User.new(user_params)

      if user.save
        token = user.generate_jwt
        Rails.logger.info "[Auth] Registration successful for email: #{user.email}"
        set_jwt_cookie(token)
        render json: { 
          message: 'User registered successfully',
          email: user.email,
          last_login: user.last_login
        }, status: :created
      else
        Rails.logger.error "[Auth] Registration failed for email: #{params[:user][:email]}, errors: #{user.errors.full_messages}"
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def login
      Rails.logger.info "[Auth] Login attempt for email: #{params[:email]}"
      user = User.find_by(email: params[:email].downcase)

      if user&.authenticate(params[:password])
        token = user.generate_jwt
        user.update(last_login: Time.current)
        
        Rails.logger.info "[Auth] Login successful for email: #{user.email}"
        Rails.logger.info "[Auth] Generated token: #{token[0..10]}..."
        
        set_jwt_cookie(token)
        
        Rails.logger.info "[Auth] Cookie set with token"
        Rails.logger.info "[Auth] Response headers: #{response.headers.to_h}"
        
        render json: { 
          message: 'Logged in successfully',
          email: user.email,
          last_login: user.last_login
        }
      else
        Rails.logger.error "[Auth] Login failed for email: #{params[:email]}"
        render json: { error: 'Invalid email or password' }, status: :unauthorized
      end
    end

    def logout
      Rails.logger.info "[Auth] Logout attempt"
      cookies.delete(:jwt, domain: nil)
      Rails.logger.info "[Auth] Cookie deleted"
      render json: { message: 'Logged out successfully' }
    end

    def check
      Rails.logger.info "[Auth] Auth check for user: #{current_user.email}"
      render json: { 
        email: current_user.email,
        last_login: current_user.last_login
      }
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :password_confirmation)
    end

    def set_jwt_cookie(token)
      Rails.logger.info "[Auth] Setting JWT cookie"
      cookie_options = {
        value: token,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :lax,
        domain: nil,
        path: '/',
        expires: 24.hours.from_now
      }
      
      Rails.logger.info "[Auth] Cookie options: #{cookie_options}"
      
      cookies[:jwt] = cookie_options
      
      Rails.logger.info "[Auth] Cookie set successfully"
      Rails.logger.info "[Auth] All cookies: #{cookies.to_h}"
    end
  end
end
