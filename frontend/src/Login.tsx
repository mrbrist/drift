import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import checkIfLoggedIn from "./helpers/checkloggedin";
import "./App.css";

declare global {
  interface Window {
    google: any;
  }
}

function Login() {
  const initialized = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    checkIfLoggedIn(navigate, "/app", "/login");

    if (!window.google) {
      console.error("Google Identity Services not loaded");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response: { credential: string }) => {
        try {
          console.log("Google JWT:", response.credential);

          const res = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              GoogleJWT: response.credential,
            }),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Login failed");
          }

          navigate("/app", { replace: true });
        } catch (err) {
          console.error("Login error:", err);
        }
      },
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleSignIn")!,
      {
        theme: "outline",
        size: "large",
        width: 250,
      }
    );
  }, []);

  return (
    <div className="items-center justify-center grid grid-cols-1">
      <div>
        <h1 className="text-4xl font-bold text-white inline-block">Drift</h1>
      </div>
      <div className="mt-20">
        <div id="googleSignIn" className="justify-center flex" />
      </div>
    </div>
  );
}

export default Login;
