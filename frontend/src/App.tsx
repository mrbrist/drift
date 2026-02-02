import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import driftLogo from "./assets/drift-logo.svg";
import { bButton } from "./modules/bigButton";
import { checkIfLoggedIn, handleLogout, getUserData } from "./api/auth";
import type { UserInterface } from "./helpers/interfaces";
import { useBoards } from "./api/useBoards";
import { sButton } from "./modules/smallButton";

function App() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserInterface | null>(null);
  const { boards, addBoard, removeBoard, editBoard } = useBoards();

  function logout() {
    handleLogout(navigate);
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
          {bButton("green", "md", "New Board", false, "mr-2", addBoard)}

          {bButton("red", "md", "Log Out", false, "", logout)}
        </div>

        <div className="pb-5" />
        {boards?.map((board) => (
          <h4 key={board.id}>
            {board.title} - <span className="text-slate-600">{board.id}</span>{" "}
            {sButton("red", "Delete", false, "", () => removeBoard(board.id))}
            {sButton("green", "Edit", false, "", () =>
              editBoard(board.id, "jeff"),
            )}
            {sButton("blue", "Open", false, "", () =>
              navigate(`/board/${board.id}`),
            )}
          </h4>
        ))}
      </div>
    </div>
  );
}

export default App;
