import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import PlayerSearch from './PlayerSearch'
import LoadingPage from "./LoadingPage"

function App() { 

  return ( 

    <div className='page-shell'>
      <main className='container home-page'>
        <PlayerSearch />
      </main>
    </div>

  );
}

export default App