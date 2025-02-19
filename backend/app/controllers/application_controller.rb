class ApplicationController < ActionController::API
  include JwtAuthentication
  include ActionController::Cookies
end
