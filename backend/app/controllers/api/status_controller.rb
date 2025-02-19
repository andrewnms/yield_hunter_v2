module Api
  class StatusController < ApplicationController
    def index
      render json: {
        status: 'ok',
        message: 'API is running',
        timestamp: Time.current,
        environment: Rails.env
      }
    end
  end
end
