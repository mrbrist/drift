import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import driftLogo from "./assets/drift-logo.svg";
import "./App.css";
import bigButton from "./helpers/bigButton";

function Home() {
  const navigate = useNavigate();

  function handleRegisterClick() {
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
        {bigButton("blue", "50", "Sign Up", true, handleRegisterClick)}
      </div>
    </div>
  );
}

export default Home;
