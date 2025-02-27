require File.expand_path('../boot', __FILE__)
require 'uri'
require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Archivist
  class Application < Rails::Application
    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    # config.i18n.default_locale = :de

    # Do not swallow errors in after_commit/after_rollback callbacks.
    # config.active_record.raise_in_transactional_callbacks = true

    config.active_record.schema_format = :sql

    config.assets.paths += %W(#{config.root}/vendor/assets)

    # config.assets.precompile << %r(.*.(?:eot|svg|ttf|woff|woff2)$)
    config.assets.precompile << %w( *.eot *.svg *.woff *.woff2 *.ttf)

    config.autoload_paths += %W(#{config.root}/lib #{config.root}/app/services)

    config.enable_dependency_loading = true
    config.action_mailer.delivery_method = (ENV['MAILER'] || '').to_sym

    # enable sidekiq as active job adapter
    config.active_job.queue_adapter = :sidekiq

    config.action_mailer.default_url_options = {host: (ENV['HOSTNAME'] || 'localhost')}

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource(
          '*',
          headers: :any,
          methods: [:get, :patch, :put, :delete, :post, :options]
          )
      end
    end

    config.after_initialize do
      begin
        if $redis.ping === 'PONG'
          puts 'Redis is connected.'
        else
          raise 'Did not reply "PONG"'
        end
      rescue
        puts 'Redis is NOT connected.'
      end
    end
  end
end
