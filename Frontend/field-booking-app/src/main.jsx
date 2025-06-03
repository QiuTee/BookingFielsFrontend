import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { BookingProvider } from './context/BookingContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { FieldProvider } from './context/FieldContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <NotificationProvider>
            <FieldProvider> 
              <App />
            </FieldProvider>
          </NotificationProvider>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
