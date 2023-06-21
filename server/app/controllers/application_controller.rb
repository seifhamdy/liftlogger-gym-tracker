class ApplicationController < ActionController::API
  before_action :authenticate_request
  attr_reader :current_user

  private

  def authenticate_request
    @current_user = AuthorizeApiRequest.new(request.headers).result
    render json: { error: "Not authorized" }, status: :unauthorized unless @current_user
  rescue ExceptionHandler::MissingToken, JWT::DecodeError => e
    render json: { error: "Invalid token" }, status: :unauthorized
  end
end
