import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Modal from 'react-modal'

Modal.setAppElement('#root')

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <GoogleOAuthProvider clientId="908912375420-acl7jai127m4miqtcd5bst3vesvdodsr.apps.googleusercontent.com">
    <React.StrictMode>
        <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
)
