# frozen_string_literal: true

require_relative "boot"

require "rails/all"

Bundler.require(*Rails.groups)

module ScribbleByAnmolKumar
  class Application < Rails::Application
    config.active_job.queue_adapter = :sidekiq
    config.load_defaults 6.1
    config.generators do |g|
      g.orm :active_record, primary_key_type: :uuid
    end
  end
end
