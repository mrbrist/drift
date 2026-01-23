import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { bButton } from "./modules/bigButton";
import { checkIfLoggedIn, handleLogout } from "./api/auth";
import { useBoard } from "./api/useBoard";
import Column from "./modules/Column";
import { getNewCardPosition } from "./helpers/position";

function Board() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { board, addCard, editCard, removeCard } = useBoard(id);

  const [localBoard, setLocalBoard] = useState(board);

  useEffect(() => {
    if (!id) navigate("/app", { replace: true });
    else checkIfLoggedIn(navigate, `/board/${id}`, "/login");
  }, [id, navigate]);

  useEffect(() => {
    if (board) setLocalBoard(board);
  }, [board]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const activeId = active.id;
    const targetColumnId = over?.data.current?.columnId;
    const sourceColumnId = active.data.current?.columnId;

    if (!targetColumnId || !sourceColumnId) return;

    const sourceColumn = board?.columns.find((c) => c.id === sourceColumnId);
    const targetColumn = board?.columns.find((c) => c.id === targetColumnId);
    if (!sourceColumn || !targetColumn) return;

    const activeCard = sourceColumn.cards.find((c) => c.id === active.id);
    if (!activeCard) return;

    if (event.over?.data.current?.sortable) {
      const sortedTargetCards = [...targetColumn.cards]
        .filter((c) => c.id !== activeId)
        .sort((a, b) => a.position - b.position);

      let overIndex = event.over?.data.current?.sortable.index;

      const insertIndex =
        overIndex === -1 ? sortedTargetCards.length : overIndex;

      const newPosition = getNewCardPosition(sortedTargetCards, insertIndex);

      editCard(sourceColumnId, activeId.toString(), {
        title: activeCard.title,
        column_id: targetColumnId,
        position: newPosition,
      });
    } else {
      editCard(sourceColumnId, active.id.toString(), {
        title: activeCard.title,
        column_id: targetColumnId,
        position: 1024,
      });
    }
  }

  function handleDragOver(event: DragOverEvent) {
    console.log(event);
  }

  return (
    <div className="grid place-items-center text-white mt-20">
      <div className="w-full max-w-5xl">
        {board ? board.id : "Loading board..."}

        <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {localBoard?.columns.map((column) => (
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
