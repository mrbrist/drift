import { useEffect, useRef } from 'react'
import driftLogo from './assets/drift-logo.svg'
import './App.css'

declare global {
  interface Window {
    google: any
  }
}

function attemptLogin() {
  fetch("http://localhost:8080/app", {
      method: "GET",
      credentials: "include", // important if backend is on a different domain/port
    })
      .then(res => res.text())
      .then(data => console.log(data));

    if (!window.google) {
      console.error('Google Identity Services not loaded')
      return
    }
}

function App() {
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    attemptLogin()

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response: { credential: string }) => {
        try {
          console.log('Google JWT:', response.credential)

          const res = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({
              GoogleJWT: response.credential,
            }),
          })

          if (!res.ok) {
            const err = await res.json()
            throw new Error(err.error || 'Login failed')
          }

          attemptLogin()

          // const data: { token: string } = await res.json()

          // console.log('App JWT:', data.token)
        } catch (err) {
          console.error('Login error:', err)
        }
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
    <div className="items-center justify-center grid grid-cols-1">
      <div>
        <img
          src={driftLogo}
          className="inline-block"
          alt="Drift Logo"
          width="200"
        />
      </div>

      <div>
        <h1 className="text-4xl font-bold text-white inline-block">drift</h1>
        <h2 className="mt-4 text-white">
          Simple kanban boards for focused project management
        </h2>
      </div>

      <div className="mt-20">
        <div id="googleSignIn" className="justify-center flex" />
      </div>
    </div>
  )
}

export default App
