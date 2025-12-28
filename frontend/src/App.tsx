import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkIfLoggedIn from "./helpers/checkloggedin";
import driftLogo from "./assets/drift-logo.svg";
import "./App.css";

function App() {
  const navigate = useNavigate();

  function handleLogout() {
    fetch("http://localhost:8080/api/logout", {
      credentials: "include",
    }).then(() => {
      checkIfLoggedIn(navigate, "/app", "/login");
    });
  }

  useEffect(() => {
    checkIfLoggedIn(navigate, "/app", "/login");
  }, []);

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

      <div className="mt-20 text-white">
        <h1>LOGGED IN</h1>
      </div>
      <div className="mt-20">
        <button
          className="
              relative
              px-8 py-3
              rounded-xl
              font-semibold
              text-red-400
              border border-red-500/40
              bg-red-500/5
              backdrop-blur
              transition-all duration-300 ease-out
              hover:text-white
              hover:bg-red-500/20
              hover:border-red-400
              hover:shadow-[0_0_25px_-5px_rgba(239,68,68,0.6)]
              focus:outline-none
              focus:ring-2 focus:ring-red-500/50
              w-50
            "
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default App;
