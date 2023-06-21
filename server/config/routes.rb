Rails.application.routes.draw do
  devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      resources :users, only: [:create]
      post '/login', to: 'sessions#create'
      delete '/logout', to: 'sessions#destroy'
      resources :workouts, except: [:show]
    end
  end

  # Defines the root path route ("/")
  # root "articles#index"
end
