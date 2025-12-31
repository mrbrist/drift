import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import checkIfLoggedIn from "./helpers/checkloggedin";
import driftLogo from "./assets/drift-logo.svg";
import "./App.css";
import { bButton } from "./helpers/bigButton";
import getUserData from "./helpers/kanban";
import type { UserInterface } from "./helpers/interfaces";

function App() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserInterface | null>(null);

  function handleLogout() {
    fetch("http://localhost:8080/api/logout", {
      credentials: "include",
    }).then(() => {
      checkIfLoggedIn(navigate, "/app", "/login");
    });
  }

  useEffect(() => {
    checkIfLoggedIn(navigate, "/app", "/login");

    getUserData(setUserData);
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
        <h2>{userData?.Email}</h2>
      </div>
      <div className="mt-20">
        {bButton("red", "md", "Log Out", false, handleLogout)}
      </div>
    </div>
  );
}

export default App;
