import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "./assets/styles/style.css"
import "./assets/styles/category.css"
import "./assets/styles/auth.css"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if (import.meta.env.DEV) {

  const hasReset = sessionStorage.getItem("reset_done")

  if (!hasReset) {

    localStorage.removeItem("user")

    sessionStorage.setItem("reset_done", "true")
  }

}


