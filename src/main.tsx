import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Game from './components/Game.tsx'
import Navbar from './components/Navbar.tsx'
import { ThirdwebProvider } from 'thirdweb/react'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <Navbar />
      <Game />
    </ThirdwebProvider>
  </React.StrictMode>,
)
