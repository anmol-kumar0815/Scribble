# frozen_string_literal: true

Rails.application.routes.draw do
  defaults format: :json do
    namespace :api do
      namespace :admin do
        resources :articles, only: %i[index create update show] do
          collection do
            patch "move"
            get "status_counts"
            get "published"
            post "bulk_delete"
            resource :report, only: %i[create], module: :articles do
              get "download", on: :collection
            end
          end
          member do
            patch "reorder"
            get "versions"
          end
        end

        resources :categories, only: %i[index create update destroy] do
          patch "reorder", on: :member
        end

        resource :organization, only: %i[create show update]
        resources :redirections, only: %i[index create update destroy]
        resources :visits, only: %i[update], param: :slug
        resource :user, only: %i[show]
      end
      namespace :public do
        resources :articles, only: %i[index show], param: :slug
        resources :categories, only: %i[index]
      end
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
