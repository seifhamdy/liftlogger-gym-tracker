import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, OverlayTrigger } from 'react-bootstrap'
import Popover from 'react-bootstrap/Popover'
import 'bootstrap/dist/css/bootstrap.min.css'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { getApiUrl } from './config/apiConfig'

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const [signupModalOpen, setSignupModalOpen] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const openLoginModal = () => {
    setLoginModalOpen(true)
  }

  const closeLoginModal = () => {
    setLoginModalOpen(false)
  }

  const openSignupModal = () => {
    setSignupModalOpen(true)
  }

  const closeSignupModal = () => {
    setSignupModalOpen(false)
  }

  useEffect(() => {
    if (!signupModalOpen || !loginModalOpen) {
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    }
  }, [signupModalOpen, loginModalOpen])

  const renderEmailPopover = (content: string) => {
    const showPopover = !isEmailValid()

    return showPopover ? (
      <Popover id="email-popover">
        <Popover.Body>{content}</Popover.Body>
      </Popover>
    ) : (
      <div></div>
    )
  }

  const renderPasswordPopover = (content: string) => {
    const showPopover = !isPasswordValid()

    return showPopover ? (
      <Popover id="password-popover">
        <Popover.Body>{content}</Popover.Body>
      </Popover>
    ) : (
      <div></div>
    )
  }

  const isPasswordValid = () => {
    const passwordRegex = /^[\w]+$/
    return password.length >= 6 && passwordRegex.test(password)
  }

  const isEmailValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return email !== '' && emailRegex.test(email)
  }

  const handleLoginSubmit = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include',
      })

      if (response.ok) {
        const responseData = await response.json()
        document.cookie = `token=${responseData.token}; path=/; secure; HttpOnly`;
        navigate('/dashboard')
      } else {
        console.log('Login Failed')
      }
    } catch (error) {
      console.log('Login error', error)
    }
  }

  const handleSignupSubmit = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            email,
            password,
            password_confirmation: confirmPassword,
          },
        }),
      })

      if (response.ok) {
        setSignupModalOpen(false)
      } else {
        console.log('Registration Failed')
      }
    } catch (error) {
      console.log('Registration Error:', error)
    }
  }
  const authenticateUser = async (credential: string) => {
    try {
      const response = await fetch('/api/v1/users/google_oauth2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      })

      if (response.ok) {
        const responseData = await response.json()
        document.cookie = `token=${responseData.token}; path=/; secure; HttpOnly`;
        navigate('/dashboard')
      } else {
        console.log('Authentication Failed')
      }
    } catch (error) {
      console.log('Authentication Error:', error)
    }
  }

  return (

      <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 bg-dark">
        <h1 className="display-1 text-center text-white">LiftLogger</h1>
        <div className="button-container mt-4 d-flex flex-column">
          <button
            className="btn btn-primary btn-lg btn-block mb-3"
            onClick={openLoginModal}
          >
            Login
          </button>
          <button
            className="btn btn-success btn-lg btn-block mb-3"
            onClick={openSignupModal}
          >
            Sign Up
          </button>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                authenticateUser(credentialResponse.credential)
              } else {
                console.log('Credential is undefined')
              }
            }}
            onError={() => {
              console.log('Login Failed')
            }}
          />
          ;
        </div>

        <Modal show={loginModalOpen} onHide={closeLoginModal} centered>
          <Modal.Header>
            <Modal.Title className="mx-auto">Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="login-email" className="mb-2">
                <Form.Label className="mb-1">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="login-password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={handleLoginSubmit}
              disabled={!(isEmailValid() && isPasswordValid())}
              className="mx-auto"
            >
              Log in
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={signupModalOpen} onHide={closeSignupModal} centered>
          <Modal.Header>
            <Modal.Title className="mx-auto">Sign Up</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="signup-email" className="mb-2">
                <Form.Label className="mb-1">Email</Form.Label>
                <OverlayTrigger
                  trigger="focus"
                  placement="top"
                  overlay={renderEmailPopover(
                    'Email must be valid and not empty'
                  )}
                >
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </OverlayTrigger>
              </Form.Group>

              <Form.Group controlId="signup-password" className="mb-2">
                <Form.Label className="mb-1">Password</Form.Label>
                <OverlayTrigger
                  trigger="focus"
                  placement="top"
                  overlay={renderPasswordPopover(
                    'Password must be 6 or more alphanumeric characters or underscores'
                  )}
                >
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </OverlayTrigger>
              </Form.Group>
              <Form.Group controlId="signup-confirm-password">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer className="mx-auto">
            <Button
              variant="primary"
              onClick={handleSignupSubmit}
              disabled={
                !(
                  isEmailValid() &&
                  isPasswordValid() &&
                  password === confirmPassword
                )
              }
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  )
}

export default HomePage
