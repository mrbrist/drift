// import { useState } from 'react'
import driftLogo from './assets/drift-logo.svg'
import './App.css'

function App() {
  return (
    <>
    <div className="items-center justify-center grid grid-cols-1">
      <div>
        <img src={driftLogo} className="inline-block" alt="Drift Logo" width="200px"/>
      </div>
      <div>
        <h1 className="text-4xl font-bold text-white inline-block">drift</h1>
        <h2 className='mt-4'>Simple kanban boards for focused project management</h2>
      </div>
      <div className='mt-20'>Login with Google</div>
    </div>
    </>
  )
}

export default App
