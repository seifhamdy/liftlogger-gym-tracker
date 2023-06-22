module ExceptionHandler
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :handle_record_invalid
    rescue_from ActionController::ParameterMissing, with: :handle_parameter_missing
    rescue_from JWT::DecodeError, with: :handle_invalid_token
    rescue_from ActionController::RoutingError, with: :handle_routing_error
  end

  private

  def handle_not_found(exception)
    render_error(exception.message, :not_found)
  end

  def handle_record_invalid(exception)
    render_error(exception.message, :unprocessable_entity)
  end

  def handle_parameter_missing(exception)
    render_error(exception.message, :unprocessable_entity)
  end

  def handle_invalid_token(exception)
    render_error(exception.message, :unauthorized)
  end

  def handle_routing_error(exception)
    render_error('Route not found', :not_found)
  end

  def render_error(message, status)
    render json: { error: message }, status: status
  end
end
