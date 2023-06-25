class JsonWebToken
  SECRET_KEY = Rails.application.secrets.secret_key_base

  def self.encode(payload)
    JWT.encode(payload, SECRET_KEY)
  end

  def self.decode(token)
    puts token
    body = JWT.decode(token, SECRET_KEY)[0]
    puts body
    puts HashWithIndifferentAccess.new(body)
  rescue JWT::DecodeError => e
    nil
  end
end
