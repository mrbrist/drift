import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import checkIfLoggedIn from "./helpers/checkloggedin";
import driftLogo from "./assets/drift-logo.svg";
import "./App.css";
import bigButton from "./helpers/bigButton";

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
        {bigButton("red", "50", "Log Out", false, handleLogout)}
      </div>
    </div>
  );
}

export default App;
