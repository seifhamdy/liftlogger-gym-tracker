class ApplicationController < ActionController::API
  include ActionController::Cookies
  before_action :authenticate_request
  attr_reader :current_user

  include ExceptionHandler

  private

  def authenticate_request
    token = cookies['jwt_token'] || request.headers['Authorization']
    @current_user = AuthorizeApiRequest.new(token).result
    render json: { error: "Not authorized" }, status: :unauthorized unless @current_user
  rescue ExceptionHandler::MissingToken, JWT::DecodeError => e
    render json: { error: "Invalid token" }, status: :unauthorized
  end


  module ExceptionHandler
    class MissingToken < StandardError; end
  end
end
