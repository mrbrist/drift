import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import driftLogo from "./assets/drift-logo.svg";
import { bButton } from "./modules/bigButton";
import {
  checkIfLoggedIn,
  handleLogout,
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

  function logout() {
    handleLogout(navigate);
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
          width="100"
        />
      </div>

      <div>
        <h1 className="text-4xl font-bold text-white inline-block">drift</h1>
        <h2 className="mt-4 text-white">
          Simple kanban boards for focused project management
        </h2>
      </div>

      <div className="mt-10 text-white">
        <h1>LOGGED IN</h1>
        <h2 className="pb-5 text-slate-400">{userData?.email}</h2>
        <div className="ml">
          {bButton("green", "md", "New Board", false, "mr-2", () =>
            handleCreateBoard(setBoards)
          )}

          {bButton("red", "md", "Log Out", false, "", logout)}
        </div>

        <div className="pb-5" />
        {boards?.map((board) => (
          <h4 key={board.id}>
            {board.title} - <span className="text-slate-600">{board.id}</span>{" "}
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
                  prev ? prev.filter((b) => b.id !== board.id) : prev
                );

                const success = await deleteBoard(board.id);
                if (!success) {
                  getBoards(setBoards);
                }
              }}
            >
              Delete
            </button>
            <button
              className="ml-3
                        mb-3
                        px-3 py-1
                        text-sm font-medium
                        text-blue-500
                        border border-blue-500/30
                        rounded-md
                        hover:bg-blue-500 hover:text-white
                        hover:border-blue-500
                        transition-colors
                        duration-150"
              onClick={() => {
                navigate(`/board/${board.id}`);
              }}
            >
              Open Board
            </button>
          </h4>
        ))}
      </div>
    </div>
  );
}

export default App;
