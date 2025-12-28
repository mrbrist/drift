import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import checkIfLoggedIn from "./helpers/checkloggedin";

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
          const res = await fetch("http://localhost:8080/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ GoogleJWT: response.credential }),
          });

          if (!res.ok) throw new Error("Google login failed");

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
        width: 260,
      }
    );
  }, [navigate]);

  return (
    <div className="flex items-center justify-center text-white">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-4xl font-bold">Drift</h1>
        <p className="text-white/60">Sign in to continue</p>

        {/* Google */}
        <div id="googleSignIn" className="flex justify-center" />

        {/* Divider */}
        <div className="flex items-center gap-4">
          <hr className="flex-1 border-white/10" />
          <span className="text-xs text-white/40">MORE OPTIONS</span>
          <hr className="flex-1 border-white/10" />
        </div>

        {/* Coming Soon Providers */}
        <div className="space-y-3">
          <ProviderButton label="GitHub" />
          <ProviderButton label="Discord" />
          <ProviderButton label="Apple" />
        </div>

        <p className="text-xs text-white/20 mt-6 uppercase">
          More login options coming soon
        </p>
      </div>
    </div>
  );
}

function ProviderButton({ label }: { label: string }) {
  return (
    <button
      disabled
      className="
        w-full py-3 rounded-xl
        border border-white/10
        bg-white/5
        text-white/40
        backdrop-blur
        cursor-not-allowed
        relative
      "
    >
      <span>{label}</span>
    </button>
  );
}

export default Login;
