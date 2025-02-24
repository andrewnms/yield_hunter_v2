# Configure the session store for Rails
Rails.application.config.session_store :cookie_store,
  key: '_yield_hunter_session',
  domain: :all,
  tld_length: 2,
  secure: Rails.env.production?,
  httponly: true,
  same_site: :lax
