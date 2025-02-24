Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    get 'status', to: 'status#index'
    # Authentication routes
    post '/auth/register', to: 'auth#register'
    post '/auth/login', to: 'auth#login'
    delete '/auth/logout', to: 'auth#logout'
    get '/auth/check', to: 'auth#check'

    # Bank accounts routes
    resources :bank_accounts do
      member do
        get 'projection', to: 'bank_accounts#projection'
      end
    end

    # Yield rates routes
    resources :yield_rates, only: [:index]

    # Promos routes - public access
    resources :promos, only: [:index]

    namespace :admin do
      # Admin-only routes
      resources :yield_rates, only: [:index, :create]
      resources :promos
    end
  end

  # Defines the root path route ("/")
  # root "posts#index"
end
