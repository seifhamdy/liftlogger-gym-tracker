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
  rescue ActiveRecord::RecordNotFound => e
    nil
  end

  def guest_user
    return if @headers["Authorization"].nil?
    User.new # Create a new guest user for the sign-up endpoint
  end

  def decoded_auth_token
    @decoded_auth_token ||= JsonWebToken.decode(http_auth_header)
  end

  def http_auth_header
    @headers["Authorization"].presence
  end
end
