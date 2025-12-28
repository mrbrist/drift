import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import driftLogo from "./assets/drift-logo.svg";
import "./App.css";

function Home() {
  const navigate = useNavigate();

  function handleLoginClick() {
    navigate("/login", { replace: true });
  }

  useEffect(() => {}, []);

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
        <button
          className="
            relative
            px-8 py-3
            rounded-xl
            font-semibold
            text-blue-400
            border border-blue-500/40
            bg-blue-500/5
            backdrop-blur
            transition-all duration-300 ease-out
            hover:text-white
            hover:bg-blue-500/20
            hover:border-blue-400
            hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.6)]
            focus:outline-none
            focus:ring-2 focus:ring-blue-500/50 w-50
            "
          onClick={handleLoginClick}
        >
          Log In
        </button>
      </div>
    </div>
  );
}

export default Home;
