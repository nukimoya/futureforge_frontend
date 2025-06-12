import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ToastContainer, Bounce } from 'react-toastify';
import AuthContextProvider from './context/authContextProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

  <ToastContainer 
    position='top-right'
    autoClose={5000}
    hideProgressBar={false}
    newestOnTop={false}
    closeOnClick
    rtl={false}
    theme='dark'
    transition={Bounce}
    stacked
  />
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </StrictMode>,
)
