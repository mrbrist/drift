import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bButton } from "./modules/bigButton";
import { checkIfLoggedIn, getBoard, handleLogout } from "./helpers/api";
import type { BoardInterface } from "./helpers/interfaces";

function Board() {
  let { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<BoardInterface | null>(null);

  function goHome() {
    navigate("/app");
  }

  function logout() {
    handleLogout(navigate);
  }

  useEffect(() => {
    checkIfLoggedIn(navigate, `/board/${id}`, "/login");

    if (!id) return;

    const loadBoard = async () => {
      try {
        const data = await getBoard(id);
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
          {bButton("blue", "md", "Home", false, "mr-2", goHome)}
          {bButton("red", "md", "Log Out", false, "", logout)}
        </div>
      </div>
    </div>
  );
}

export default Board;
