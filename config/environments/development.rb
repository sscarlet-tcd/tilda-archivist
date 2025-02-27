Rails.application.configure do
  # Settings specified here will take precedence over those in config/application.rb.

  # In the development environment your application's code is reloaded on
  # every request. This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports and disable caching.
  config.consider_all_requests_local = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send.
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Asset digests allow you to set far-future HTTP expiration dates on all assets,
  # yet still be able to expire them through the digest params.
  config.assets.digest = true

  # Adds additional error checking when serving assets at runtime.
  # Checks for improperly declared sprockets dependencies.
  # Raises helpful error messages.
  config.assets.raise_runtime_errors = true

  # Raises error for missing translations
  # config.action_view.raise_on_missing_translations = true

  config.public_file_server.enabled = false

  # enable sidekiq as active job adapter
  config.active_job.queue_adapter = :sidekiq

  config.public_file_server.enabled = true

  config.action_dispatch.rack_cache = {
      metastore: (ENV["REDIS_URL"] || 'redis://127.0.0.1:6379') + '/1/metastore',
      entitystore: (ENV["REDIS_URL"] || 'redis://127.0.0.1:6379') + '/1/entitystore'
  }

  config.action_mailer.default_url_options = { host: 'localhost:3000' }
  config.asset_host = 'localhost:3000'

  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    :user_name => '847c5c4ef88c21',
    :password => '812b752cdf8ef1',
    :address => 'smtp.mailtrap.io',
    :domain => 'smtp.mailtrap.io',
    :port => '2525',
    :authentication => :cram_md5
  }
end
