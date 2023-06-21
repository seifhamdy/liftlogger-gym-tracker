class Api::V1::SessionsController < ApplicationController
  def create
    user = User.find_by(email: params[:email])
    if user&.authenticate(params[:password])
      # Generate and return authentication token or use sessions
      render json: { token: "generated_token" }, status: :ok
    else
      render json: { error: "Invalid email or password" }, status: :unauthorized
    end
  end

  def destroy
    # Clear or invalidate the authentication token or session
    render json: { message: "Logged out successfully" }, status: :ok
  end
end
