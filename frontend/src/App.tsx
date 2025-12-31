import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import driftLogo from "./assets/drift-logo.svg";
import { bButton } from "./modules/bigButton";
import {
  checkIfLoggedIn,
  getUserData,
  getBoards,
  deleteBoard,
} from "./helpers/api";
import type { BoardsInterface, UserInterface } from "./helpers/interfaces";
import { handleCreateBoard } from "./helpers/kanban";

function App() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserInterface | null>(null);
  const [boards, setBoards] = useState<BoardsInterface>([]);

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
    getBoards(setBoards);
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
        {bButton("green", "md", "New Board", false, () =>
          handleCreateBoard(setBoards)
        )}
        <br />
        {boards?.map((board) => (
          <h4 key={board.ID}>
            {board.Title} - <span className="text-slate-600">{board.ID}</span>{" "}
            <button
              className="ml-3
                        mb-3
                        px-3 py-1
                        text-sm font-medium
                        text-red-500
                        border border-red-500/30
                        rounded-md
                        hover:bg-red-500 hover:text-white
                        hover:border-red-500
                        transition-colors
                        duration-150"
              onClick={async () => {
                setBoards((prev) =>
                  prev ? prev.filter((b) => b.ID !== board.ID) : prev
                );

                const success = await deleteBoard(board.ID);
                if (!success) {
                  getBoards(setBoards);
                }
              }}
            >
              Delete
            </button>
          </h4>
        ))}
      </div>
      <div className="mt-20">
        {bButton("red", "md", "Log Out", false, handleLogout)}
      </div>
    </div>
  );
}

export default App;
