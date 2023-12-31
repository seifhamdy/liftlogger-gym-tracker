class Api::V1::SessionsController < ApplicationController
  include ActionController::Cookies
  skip_before_action :authenticate_request, only: :create

  def create
    user = User.find_by(email: params[:email])
    if user && user.valid_password?(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      cookies[:jwt_token] = { value: token, httponly: true }
      response.headers['Authorization'] = token
      render json: { message: "Logged in" }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def destroy
    cookies.delete(:jwt_token)
    render json: { message: "Logged out successfully" }, status: :ok
  end
end
