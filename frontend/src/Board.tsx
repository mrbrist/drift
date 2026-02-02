import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { bButton } from "./components/bigButton";
import { checkIfLoggedIn, handleLogout } from "./api/auth";
import { useBoard } from "./api/useBoard";
import Column from "./kanban/Column";
import { getNewCardPosition } from "./helpers/position";

function Board() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { board, addCard, editCard, removeCard } = useBoard(id);
  const [isDragging, setIsDragging] = useState(false);
  const [localBoard, setLocalBoard] = useState(board);

  useEffect(() => {
    if (!id) navigate("/app", { replace: true });
    else checkIfLoggedIn(navigate, `/board/${id}`, "/login");
  }, [id, navigate]);

  useEffect(() => {
    if (board && !isDragging) setLocalBoard(board);
  }, [board, isDragging]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || !localBoard) return;

    const activeId = active.id;
    const sourceColumnId = active.data.current?.columnId;
    const targetColumnId = over.data.current?.columnId;

    if (!sourceColumnId || !targetColumnId) return;

    const sourceColumn = localBoard.columns.find(
      (c) => c.id === sourceColumnId,
    );
    const targetColumn = localBoard.columns.find(
      (c) => c.id === targetColumnId,
    );
    if (!sourceColumn || !targetColumn) return;

    const activeCard = sourceColumn.cards.find((c) => c.id === activeId);
    if (!activeCard) return;

    // Determine index in target column
    let insertIndex = targetColumn.cards.length;

    if (over.data.current?.sortable) {
      const overIndex = over.data.current.sortable.index;
      insertIndex = overIndex === -1 ? targetColumn.cards.length : overIndex;
    }

    const sortedTargetCards = targetColumn.cards
      .filter((c) => c.id !== activeId)
      .sort((a, b) => a.position - b.position);

    const newPosition = getNewCardPosition(sortedTargetCards, insertIndex);

    editCard(sourceColumnId, activeId.toString(), {
      title: activeCard.title,
      column_id: targetColumnId,
      position: newPosition,
    });

    // THIS IS REALLY BAD, THIS NEEDS FIXING
    // reloadBoard();
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || !localBoard) return;

    const activeId = active.id;
    const sourceColumnId = active.data.current?.columnId;
    const targetColumnId = over.data.current?.columnId;

    if (!sourceColumnId || !targetColumnId) return;
    if (sourceColumnId === targetColumnId) return;

    setLocalBoard((prev) => {
      if (!prev) return prev;

      const sourceColumn = prev.columns.find((c) => c.id === sourceColumnId);
      const targetColumn = prev.columns.find((c) => c.id === targetColumnId);
      if (!sourceColumn || !targetColumn) return prev;

      const activeCard = sourceColumn.cards.find((c) => c.id === activeId);
      if (!activeCard) return prev;

      return {
        ...prev,
        columns: prev.columns.map((column) => {
          if (column.id === sourceColumnId) {
            return {
              ...column,
              cards: column.cards.filter((c) => c.id !== activeId),
            };
          }

          if (column.id === targetColumnId) {
            return {
              ...column,
              cards: [...column.cards, activeCard],
            };
          }

          return column;
        }),
      };
    });
  }

  return (
    <div className="grid place-items-center text-white mt-20">
      <div className="w-full max-w-5xl">
        {board ? board.id : "Loading board..."}

        <DndContext
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(e) => {
            handleDragEnd(e);
            requestAnimationFrame(() => {
              setIsDragging(false);
            });
          }}
          onDragOver={handleDragOver}
          collisionDetection={closestCorners}
        >
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
