class ApplicationController < ActionController::API
  before_action :authenticate_request
  attr_reader :current_user

  include ExceptionHandler # Add this line to include the ExceptionHandler module

  private

  def authenticate_request
    @current_user = AuthorizeApiRequest.new(request.headers).result
    render json: { error: "Not authorized" }, status: :unauthorized unless @current_user
  rescue ExceptionHandler::MissingToken, JWT::DecodeError => e
    render json: { error: "Invalid token" }, status: :unauthorized
  end
end
