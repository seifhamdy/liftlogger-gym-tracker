class Api::V1::SessionsController < ApplicationController
  skip_before_action :authenticate_request, only: :create

  def create
    user = User.find_by(email: params[:email])
    if user && user.valid_password?(params[:password])
      token = JsonWebToken.encode(user_id: user.id)
      render json: { token: token }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def destroy
    # Clear or invalidate the authentication token or session
    render json: { message: "Logged out successfully" }, status: :ok
  end
end
