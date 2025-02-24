Rails.application.routes.draw do
  namespace :api do
    resources :bank_accounts
    resources :promos, only: [:index]
    
    namespace :admin do
      resources :yield_rates
      resources :promos
    end
  end
end
