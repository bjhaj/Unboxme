import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import './index.css'
import { AuthContextProvider } from './context/AuthContext'
import { GiftContextProvider } from './context/GiftContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <GiftContextProvider>
        <RouterProvider router={router} />
      </GiftContextProvider>
    </AuthContextProvider>
  </StrictMode>
)
