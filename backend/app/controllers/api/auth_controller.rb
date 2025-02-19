module Api
  class AuthController < ApplicationController
    skip_before_action :authenticate_user, only: [:register, :login]

    def register
      user = User.new(user_params)

      if user.save
        token = user.generate_jwt
        set_jwt_cookie(token)
        render json: { message: 'User registered successfully' }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def login
      user = User.find_by(email: params[:email].downcase)

      if user&.authenticate(params[:password])
        token = user.generate_jwt
        user.update(last_login: Time.current)
        set_jwt_cookie(token)
        render json: { message: 'Logged in successfully' }
      else
        render json: { error: 'Invalid email or password' }, status: :unauthorized
      end
    end

    def logout
      cookies.delete(:jwt, domain: :all)
      render json: { message: 'Logged out successfully' }
    end

    def check
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
      cookies.signed[:jwt] = {
        value: token,
        httponly: true,
        secure: Rails.env.production?,
        same_site: :strict,
        expires: 24.hours.from_now
      }
    end
  end
end
