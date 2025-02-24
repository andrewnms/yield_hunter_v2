module Api
  module Admin
    class PromosController < AdminController
      before_action :set_promo, only: [:show, :update, :destroy]

      # GET /api/admin/promos
      # Returns all promos, including inactive and expired ones
      # This differs from the public endpoint which only shows active, non-expired promos
      def index
        Rails.logger.info "[Admin::Promos] Fetching all promos"
        @promos = Promo.all.order(created_at: :desc)

        render json: serialize_promos(@promos)
      rescue StandardError => e
        log_error("Error fetching promos", e)
        render_error("Failed to fetch promos")
      end

      # GET /api/admin/promos/:id
      # Returns a specific promo by ID
      def show
        Rails.logger.info "[Admin::Promos] Fetching promo: #{@promo.id}"
        render json: serialize_promo(@promo)
      end

      # POST /api/admin/promos
      # Creates a new promo with the provided parameters
      def create
        Rails.logger.info "[Admin::Promos] Creating new promo: #{promo_params}"
        @promo = Promo.new(promo_params)

        if @promo.save
          Rails.logger.info "[Admin::Promos] Created promo: #{@promo.id}"
          render json: serialize_promo(@promo), status: :created
        else
          log_validation_errors(@promo)
          render json: { error: @promo.errors.full_messages.join(', ') }, status: :unprocessable_entity
        end
      rescue StandardError => e
        log_error("Error creating promo", e)
        render_error("Failed to create promo")
      end

      # PUT /api/admin/promos/:id
      # Updates an existing promo with the provided parameters
      def update
        Rails.logger.info "[Admin::Promos] Updating promo #{@promo.id}: #{promo_params}"

        if @promo.update(promo_params)
          Rails.logger.info "[Admin::Promos] Updated promo: #{@promo.id}"
          render json: serialize_promo(@promo)
        else
          log_validation_errors(@promo)
          render json: { error: @promo.errors.full_messages.join(', ') }, status: :unprocessable_entity
        end
      rescue StandardError => e
        log_error("Error updating promo", e)
        render_error("Failed to update promo")
      end

      # DELETE /api/admin/promos/:id
      # Permanently deletes a promo
      # Consider using soft delete in the future if we need to maintain promo history
      def destroy
        Rails.logger.info "[Admin::Promos] Deleting promo: #{@promo.id}"

        if @promo.destroy
          Rails.logger.info "[Admin::Promos] Deleted promo: #{@promo.id}"
          head :no_content
        else
          log_validation_errors(@promo)
          render json: { error: @promo.errors.full_messages.join(', ') }, status: :unprocessable_entity
        end
      rescue StandardError => e
        log_error("Error deleting promo", e)
        render_error("Failed to delete promo")
      end

      private

      # Sets @promo instance variable for show, update, and destroy actions
      # Renders 404 if promo is not found
      def set_promo
        @promo = Promo.find(params[:id])
      rescue Mongoid::Errors::DocumentNotFound => e
        Rails.logger.error "[Admin::Promos] Promo not found: #{params[:id]}"
        render json: { error: 'Promo not found' }, status: :not_found
      end

      # Whitelisted parameters for promo creation and updates
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

      # Serializes a collection of promos to match frontend expectations
      def serialize_promos(promos)
        promos.map { |promo| serialize_promo(promo) }
      end

      # Serializes a single promo to match frontend expectations
      # Converts MongoDB specific fields and formats dates
      def serialize_promo(promo)
        promo.as_json.merge({
          id: promo.id.to_s,
          validUntil: promo.valid_until.iso8601,
          promoType: promo.promo_type,
          ctaText: promo.cta_text,
          ctaUrl: promo.cta_url,
          createdAt: promo.created_at.iso8601,
          updatedAt: promo.updated_at.iso8601
        })
      end

      # Logs validation errors for better debugging
      def log_validation_errors(record)
        Rails.logger.error "[Admin::Promos] Validation errors: #{record.errors.full_messages}"
      end

      # Logs error with backtrace for better debugging
      def log_error(message, error)
        Rails.logger.error "[Admin::Promos] #{message}: #{error.message}"
        Rails.logger.error error.backtrace.join("\n")
      end

      # Renders a standardized error response
      def render_error(message, status = :internal_server_error)
        render json: { error: message }, status: status
      end
    end
  end
end
