import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bButton } from "./modules/bigButton";
import { checkIfLoggedIn, getBoard } from "./helpers/api";
import type { BoardInterface } from "./helpers/interfaces";

function Board() {
  let { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<BoardInterface | null>(null);

  function handleLogout() {
    fetch("http://localhost:8080/api/logout", {
      credentials: "include",
    }).then(() => {
      checkIfLoggedIn(navigate, "/app", "/login");
    });
  }

  useEffect(() => {
    checkIfLoggedIn(navigate, `/board/${id}`, "/login");

    if (!id) return;

    const loadBoard = async () => {
      try {
        const data = await getBoard(id);
        console.log(data);
        setBoard(data);
      } catch (err) {
        console.error("Failed to load board", err);
      }
    };

    loadBoard();
  }, [id, navigate]);

  return (
    <div className="items-center justify-center grid grid-cols-1">
      <div className="mt-20 text-white">
        <br />
        {board ? board.id : "Loading board..."}
        <div className="mt-20">
          {bButton("red", "md", "Log Out", false, handleLogout)}
        </div>
      </div>
    </div>
  );
}

export default Board;
