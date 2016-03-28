Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :runes, defaults: {format: :json}, only: [:index]
      resources :rune_recipes, defaults: {format: :json}, only: [:index]
      resources :rune_words, defaults: {format: :json}, only: [:index]
      resources :gems, defaults: {format: :json}, only: [:index]
    end
  end

  root 'application#index'
  get '*path' => 'application#index'
end
