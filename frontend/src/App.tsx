import { useEffect } from 'react'
import driftLogo from './assets/drift-logo.svg'
import './App.css'

declare global {
  interface Window {
    google: any
  }
}

function App() {
  useEffect(() => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        console.log('JWT:', response.credential)
      },
    })

    window.google.accounts.id.renderButton(
      document.getElementById('googleSignIn')!,
      {
        theme: 'outline',
        size: 'large',
        width: 250,
      }
    )
  }, [])
  return (
    <>
    <div className="items-center justify-center grid grid-cols-1">
      <div>
        <img src={driftLogo} className="inline-block" alt="Drift Logo" width="200px"/>
      </div>
      <div>
        <h1 className="text-4xl font-bold text-white inline-block">drift</h1>
        <h2 className='mt-4 text-white'>Simple kanban boards for focused project management</h2>
      </div>
      <div className='mt-20'>
        {/* Login with Google */}
        <div id="googleSignIn" className='justify-center flex'></div>
      </div>
    </div>
    </>
  )
}

export default App
