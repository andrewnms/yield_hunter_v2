module Api
  module Admin
    class PromosController < AdminController
      def index
        @promos = Promo.all.order(created_at: :desc)
        render json: @promos
      end

      def create
        @promo = Promo.new(promo_params)
        if @promo.save
          render json: @promo, status: :created
        else
          render json: { errors: @promo.errors }, status: :unprocessable_entity
        end
      end

      def update
        @promo = Promo.find(params[:id])
        if @promo.update(promo_params)
          render json: @promo
        else
          render json: { errors: @promo.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        @promo = Promo.find(params[:id])
        @promo.update(active: false)
        head :no_content
      end

      private

      def promo_params
        params.require(:promo).permit(
          :title,
          :description,
          :bank,
          :promo_type,
          :valid_until,
          :cta_text,
          :cta_url,
          :active
        )
      end
    end
  end
end
