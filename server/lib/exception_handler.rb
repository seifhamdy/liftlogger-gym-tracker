module ExceptionHandler
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound do |e|
      render json: { error: e.message }, status: :not_found
    end

    rescue_from ActiveRecord::RecordInvalid do |e|
      render json: { error: e.message }, status: :unprocessable_entity
    end

    rescue_from ExceptionHandler::MissingToken, with: :missing_token

    rescue_from ExceptionHandler::InvalidToken do |e|
      render json: { error: e.message }, status: :unauthorized
    end

    rescue_from ActionController::ParameterMissing do |e|
      render json: { error: e.message }, status: :unprocessable_entity
    end
  end

  private

  def missing_token(error)
    render json: { error: error.message }, status: :unprocessable_entity
  end

  class MissingToken < StandardError; end

  class InvalidToken < StandardError; end
end
