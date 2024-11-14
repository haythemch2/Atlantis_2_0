import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Navbar from './components/Navbar.tsx';
import { ThirdwebProvider } from 'thirdweb/react';
import GameContainer from './GameContainer.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ThirdwebProvider>
            <Navbar />
            <GameContainer />
        </ThirdwebProvider>
    </React.StrictMode>,
);
