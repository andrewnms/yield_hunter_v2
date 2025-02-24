module Api
  class PromosController < ApplicationController
    def index
      @promos = Promo.current.order(created_at: :desc)
      render json: @promos
    end
  end
end
