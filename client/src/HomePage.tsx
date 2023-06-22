import React from 'react'

const HomePage: React.FC = () => {
  const handleLogin = () => {
    // 
  }

  const handleSignUp = () => {
    //
  }

  const handleGoogleSignIn = () => {
    //
  }

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 bg-dark">
      <h1 className="display-1 text-center text-white">LiftLogger</h1>
      <div className="button-container mt-4 d-flex flex-column">
        <button
          className="btn btn-primary btn-lg btn-block mb-3"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="btn btn-success btn-lg btn-block mb-3"
          onClick={handleSignUp}
        >
          Sign Up
        </button>
        <button
          className="btn btn-danger btn-lg btn-block mb-3"
          onClick={handleGoogleSignIn}
        >
          Sign In with Google
        </button>
      </div>
    </div>
  )
}

export default HomePage
