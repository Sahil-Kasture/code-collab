import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './assets/context/JoinContext.jsx'
import { EditorProvider } from './assets/context/EditorContext.jsx'
import { ThemeProvider } from './assets/context/ThemeContext.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="245567048523-37d80ta0siltuh6av0r33n2hqc6tm6dr.apps.googleusercontent.com">
    <ThemeProvider>
      <AuthProvider>
        <EditorProvider>
          <App />
        </EditorProvider>
      </AuthProvider>
    </ThemeProvider>
    </GoogleOAuthProvider>
  </StrictMode>
)
