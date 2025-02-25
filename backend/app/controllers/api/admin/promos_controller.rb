module Api
  module Admin
    class PromosController < ApplicationController
      before_action :ensure_admin!
      before_action :set_promo, only: [:show, :update, :destroy]
      rescue_from Mongoid::Errors::Validations, with: :handle_validation_error
      rescue_from Mongoid::Errors::DocumentNotFound, with: :handle_not_found

      # GET /api/admin/promos
      # Returns all promos, including inactive and expired ones
      def index
        Rails.logger.info "[Admin::Promos] Fetching all promos"
        @promos = Promo.all.order(created_at: :desc)
        render json: @promos.map { |promo| serialize_promo(promo) }
      rescue StandardError => e
        Rails.logger.error "[Admin::Promos] Error fetching promos: #{e.message}"
        render json: { error: 'Failed to fetch promos' }, status: :internal_server_error
      end

      # GET /api/admin/promos/:id
      def show
        Rails.logger.info "[Admin::Promos] Fetching promo: #{@promo.id}"
        render json: serialize_promo(@promo)
      rescue StandardError => e
        Rails.logger.error "[Admin::Promos] Error fetching promo: #{e.message}"
        render json: { error: 'Failed to fetch promo' }, status: :internal_server_error
      end

      # POST /api/admin/promos
      def create
        Rails.logger.info "[Admin::Promos] Creating new promo: #{promo_params}"
        @promo = Promo.new(promo_params)

        if @promo.save
          Rails.logger.info "[Admin::Promos] Created promo: #{@promo.id}"
          render json: serialize_promo(@promo), status: :created
        else
          Rails.logger.error "[Admin::Promos] Validation errors: #{@promo.errors.full_messages}"
          render json: { error: @promo.errors.full_messages.join(', ') }, status: :unprocessable_entity
        end
      rescue StandardError => e
        Rails.logger.error "[Admin::Promos] Error creating promo: #{e.message}"
        render json: { error: 'Failed to create promo' }, status: :internal_server_error
      end

      # PUT /api/admin/promos/:id
      def update
        Rails.logger.info "[Admin::Promos] Updating promo #{@promo.id}: #{promo_params}"

        if @promo.update(promo_params)
          Rails.logger.info "[Admin::Promos] Updated promo: #{@promo.id}"
          render json: serialize_promo(@promo)
        else
          Rails.logger.error "[Admin::Promos] Validation errors: #{@promo.errors.full_messages}"
          render json: { error: @promo.errors.full_messages.join(', ') }, status: :unprocessable_entity
        end
      rescue StandardError => e
        Rails.logger.error "[Admin::Promos] Error updating promo: #{e.message}"
        render json: { error: 'Failed to update promo' }, status: :internal_server_error
      end

      # DELETE /api/admin/promos/:id
      def destroy
        Rails.logger.info "[Admin::Promos] Deleting promo: #{@promo.id}"
        @promo.destroy
        head :no_content
      rescue StandardError => e
        Rails.logger.error "[Admin::Promos] Error deleting promo: #{e.message}"
        render json: { error: 'Failed to delete promo' }, status: :internal_server_error
      end

      private

      def set_promo
        @promo = Promo.find(params[:id])
      end

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

      def serialize_promo(promo)
        {
          id: promo.id.to_s,
          title: promo.title,
          description: promo.description,
          bank: promo.bank,
          promoType: promo.promo_type,
          validUntil: promo.valid_until.iso8601,
          ctaText: promo.cta_text,
          ctaUrl: promo.cta_url,
          active: promo.active,
          createdAt: promo.created_at.iso8601,
          updatedAt: promo.updated_at.iso8601
        }
      end

      def handle_validation_error(error)
        Rails.logger.error "[Admin::Promos] Validation error: #{error.message}"
        render json: { error: error.message }, status: :unprocessable_entity
      end

      def handle_not_found(error)
        Rails.logger.error "[Admin::Promos] Not found: #{error.message}"
        render json: { error: 'Promo not found' }, status: :not_found
      end

      def ensure_admin!
        unless current_user&.admin?
          Rails.logger.warn "[Admin::Promos] Non-admin access attempt: #{current_user&.email}"
          render json: { error: 'Unauthorized - Admin access required' }, status: :unauthorized
        end
      end
    end
  end
end
