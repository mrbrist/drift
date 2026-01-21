import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bButton } from "./modules/bigButton";
import { checkIfLoggedIn, handleLogout } from "./api/api";
import { useBoard } from "./api/board";
import { sButton } from "./modules/smallButton";

function Board() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      navigate("/app", { replace: true });
    }
  }, [id, navigate]);

  const { board, addCard, editCard, removeCard } = useBoard(id);

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
            {sButton("green", "New Card", false, "", () => addCard(c.id))}
            {c.cards.map((card) => (
              <div key={card.id}>
                <span className="text-amber-100">
                  {card.id} #{card.position} - {card.title}
                </span>
                {sButton("blue", "Update Card", false, "", () =>
                  editCard(c.id, card.id, {
                    title: "bob",
                    position: 100.000000000066,
                  }),
                )}
                {sButton("red", "Delete Card", false, "", () =>
                  removeCard(c.id, card.id),
                )}
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
