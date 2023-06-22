class Workout
  include Mongoid::Document
  include Mongoid::Timestamps

  field :date, type: Date
  field :name, type: String
  field :weight, type: Integer
  field :sets, type: Integer
  field :reps, type: Integer

  belongs_to :user

  validates :date, :name, :weight, :sets, :reps, presence: true
end
