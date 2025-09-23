// Frontend/src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StoreProvider } from './Context/StoreContext.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <StoreProvider>
            <App />
        </StoreProvider>
    </StrictMode>
)
