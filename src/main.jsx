import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { LiveDataProvider } from './context/LiveDataContext.jsx'
import './styles/global.css'
import './styles/components.css'
import './styles/phase2.css'
import './styles/phase3.css'
import './styles/phase4.css'
import './styles/admin.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LiveDataProvider>
        <App />
      </LiveDataProvider>
    </BrowserRouter>
  </React.StrictMode>
)
