import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bButton } from "./modules/bigButton";
import {
  checkIfLoggedIn,
  createCard,
  getBoard,
  handleLogout,
} from "./helpers/api";
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
        {board?.columns.map((c) => (
          <div>
            <h2 key={c.id}>
              {c.id} - {c.title}
            </h2>
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
              onClick={async () => {
                const success = await createCard(board.id, c.id);
                console.log(success);
              }}
            >
              New Card
            </button>
            {c.cards.map((card) => (
              <h3 key={card.id} className="text-amber-100">
                {card.id} - {card.title}
              </h3>
            ))}
            <br />
          </div>
        ))}
        <div className="mt-20">
          {bButton("blue", "md", "Home", false, "mr-2", goHome)}
          {bButton("red", "md", "Log Out", false, "", logout)}
        </div>
      </div>
    </div>
  );
}

export default Board;
