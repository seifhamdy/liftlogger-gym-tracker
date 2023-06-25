class ApplicationController < ActionController::API
  include ActionController::Cookies
  before_action :authenticate_request
  attr_reader :current_user

  include ExceptionHandler

  private

  def authenticate_request
    token = extract_token
    puts "1"
    puts token
    @current_user = AuthorizeApiRequest.new(headers: { "Authorization" => token, "Cookie" => request.headers["Cookie"] }).result
    render json: { error: "Not authorized" }, status: :unauthorized unless @current_user
  rescue ExceptionHandler::MissingToken, JWT::DecodeError => e
    render json: { error: "Invalid token" }, status: :unauthorized
  end

  def extract_token
    auth_header = request.headers["Authorization"]
    token = cookies["jwt_token"] || (auth_header.present? && auth_header.split(" ").last)
    token || raise(ExceptionHandler::MissingToken)
  end


  module ExceptionHandler
    class MissingToken < StandardError; end
  end
end
