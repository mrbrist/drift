import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bButton } from "./modules/bigButton";
import {
  checkIfLoggedIn,
  createCard,
  deleteCard,
  handleLogout,
  updateCard,
} from "./helpers/api";
import { useBoard } from "./api/board";

function Board() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/app", { replace: true });
    }
  }, [id, navigate]);

  const { board, loading } = useBoard(id);

  useEffect(() => {
    if (!id) return;
    checkIfLoggedIn(navigate, `/board/${id}`, "/login");
  }, [id, navigate]);

  function logout() {
    handleLogout(navigate);
  }

  function goHome() {
    navigate("/app");
  }

  return (
    <div className="items-center justify-center grid grid-cols-1">
      <div className="mt-20 text-white">
        <br />
        {board ? board.id : "Loading board..."}
        {board?.columns.map((c) => (
          <div key={c.id}>
            <h2>
              {c.id} - {c.title}
            </h2>
            <button
              className="ml-3
                        mb-3
                        px-3 py-1
                        text-sm font-medium
                        text-green-500
                        border border-green-500/30
                        rounded-md
                        hover:bg-green-500 hover:text-white
                        hover:border-green-500
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
              <div key={card.id}>
                <span className="text-amber-100">
                  {card.id} #{card.position} - {card.title}
                </span>
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
                    const success = await updateCard(board.id, card.id, c.id);
                    console.log(success);
                  }}
                >
                  Update Card
                </button>
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
                    const success = await deleteCard(board.id, card.id);
                    console.log(success);
                  }}
                >
                  Delete Card
                </button>
              </div>
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
