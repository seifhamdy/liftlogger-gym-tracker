class AuthorizeApiRequest
  def initialize(headers = {})
    @headers = headers
  end

  def result
    user || guest_user
  end

  private

  def user
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
    @headers["Cookie"]&.match(/token=([^;]+)/)&.[](1)
  end

  def header_token
    @headers["Authorization"].to_s.split(" ").last.presence
  end
end
