class Api::V1::WorkoutsController < ApplicationController
  before_action :authenticate_request

  def index
    workouts = current_user.workouts
    render json: workouts, status: :ok
  end

  def create
    workout = current_user.workouts.build(workout_params)
    if workout.save
      render json: workout, status: :created
    else
      render json: { errors: workout.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    workout = current_user.workouts.find(params[:id])
    if workout.update(workout_params)
      render json: workout, status: :ok
    else
      render json: { errors: workout.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    workout = current_user.workouts.find(params[:id])
    workout.destroy
    render json: { message: 'Workout deleted' }, status: :ok
  end

  private

  def workout_params
    params.require(:workout).permit(:date, :name, :weight, :sets, :reps)
  end
end
