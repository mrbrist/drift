import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DndContext, closestCorners, type DragEndEvent } from "@dnd-kit/core";
import { bButton } from "./modules/bigButton";
import { checkIfLoggedIn, handleLogout } from "./api/auth";
import { useBoard } from "./api/useBoard";
import Column from "./modules/Column";
import { getNewCardPosition } from "./helpers/position";

function Board() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { board, addCard, editCard, removeCard } = useBoard(id);

  useEffect(() => {
    if (!id) navigate("/app", { replace: true });
    else checkIfLoggedIn(navigate, `/board/${id}`, "/login");
  }, [id, navigate]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !board) return;

    const activeId = active.id;
    const sourceColumnId = active.data.current?.columnId;
    const targetColumnId = over.data.current?.columnId;

    if (!targetColumnId) return;

    const sourceColumn = board.columns.find((c) => c.id === sourceColumnId);
    const targetColumn = board.columns.find((c) => c.id === targetColumnId);

    if (!sourceColumn || !targetColumn) return;

    const activeCard = sourceColumn.cards.find((c) => c.id === activeId);
    if (!activeCard) return;

    const sortedTargetCards = [...targetColumn.cards]
      .filter((c) => c.id !== activeId)
      .sort((a, b) => a.position - b.position);

    let overIndex = event.over?.data.current?.sortable.index;

    const insertIndex = overIndex === -1 ? sortedTargetCards.length : overIndex;

    const newPosition = getNewCardPosition(sortedTargetCards, insertIndex);

    editCard(sourceColumnId, activeId.toString(), {
      title: activeCard.title,
      column_id: targetColumnId,
      position: newPosition,
    });
  }

  return (
    <div className="grid place-items-center text-white mt-20">
      <div className="w-full max-w-5xl">
        {board ? board.id : "Loading board..."}

        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {board?.columns.map((column) => (
              <Column
                key={column.id}
                column={column}
                addCard={addCard}
                editCard={editCard}
                removeCard={removeCard}
              />
            ))}
          </div>
        </DndContext>

        <div className="mt-20">
          {bButton("blue", "md", "Home", false, "mr-2", () => navigate("/app"))}
          {bButton("red", "md", "Log Out", false, "", () =>
            handleLogout(navigate),
          )}
        </div>
      </div>
    </div>
  );
}

export default Board;
