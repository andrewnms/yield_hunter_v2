class User
  include Mongoid::Document
  include Mongoid::Timestamps
  include ActiveModel::SecurePassword

  # Fields
  field :email, type: String
  field :password_digest, type: String
  field :last_login, type: Time

  # Relations
  has_many :bank_accounts

  # Validations
  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  
  # Add secure password functionality
  has_secure_password

  # Callbacks
  before_save :downcase_email

  # Instance Methods
  def generate_jwt
    payload = {
      user_id: self.id.to_s,
      email: self.email,
      exp: 24.hours.from_now.to_i
    }
    
    JWT.encode(payload, jwt_secret_key, 'HS256')
  end

  private

  def downcase_email
    self.email = email.downcase if email.present?
  end

  def jwt_secret_key
    Rails.application.credentials.secret_key_base
  end
end
