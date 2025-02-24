module Api
  class PromosController < ApplicationController
    skip_before_action :authenticate_user!, only: [:index]

    def index
      Rails.logger.info "[Promos] Fetching current promos"
      @promos = Promo.current.order(created_at: :desc)
      
      render json: @promos.map { |promo|
        promo.as_json.merge({
          id: promo.id.to_s,
          validUntil: promo.valid_until.iso8601,
          promoType: promo.promo_type,
          ctaText: promo.cta_text,
          ctaUrl: promo.cta_url,
          createdAt: promo.created_at.iso8601,
          updatedAt: promo.updated_at.iso8601
        })
      }
    rescue StandardError => e
      Rails.logger.error "[Promos] Error fetching promos: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      render json: { error: 'Failed to fetch promos' }, status: :internal_server_error
    end
  end
end
