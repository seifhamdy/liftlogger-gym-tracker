class AuthorizeApiRequest
  def initialize(headers = {})
    @headers = headers
  end

  def result
    user || guest_user
  end

  private

  def user
    puts header_token
    puts cookie_token
    puts auth_token
    puts decoded_auth_token
    @user ||= User.find(decoded_auth_token[:user_id]) if decoded_auth_token
  rescue Mongoid::Errors::DocumentNotFound => e
    nil
  end

  def guest_user
    return if @headers["Authorization"].nil?
    User.new
  end

  def decoded_auth_token
    @decoded_auth_token ||= JsonWebToken.decode(auth_token)
  end

  def auth_token
    cookie_token || header_token
  end

  def cookie_token
    @headers[:headers]["Cookie"]&.match(/jwt_token=([^;]+)/)&.captures&.first
  end

  def header_token
    @headers[:headers]["Authorization"]&.split(" ")&.last
  end
end
