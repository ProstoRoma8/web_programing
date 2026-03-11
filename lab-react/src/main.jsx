import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Підключаємо твої космічні стилі!
import './assets/base.css'
import './assets/layout.css'
import './assets/components.css'
import './assets/media.css'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)