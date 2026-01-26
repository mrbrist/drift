import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import Card from "./Card";
import { sButton } from "./smallButton";
import type { CardInterface } from "../helpers/interfaces";

type DroppableData = {
  columnId: string;
};

function Column({ column, addCard, editCard, removeCard }: any) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { columnId: column.id } as DroppableData,
  });

  const hasCards = column.cards.length > 0;

  return (
    <div
      ref={setNodeRef}
      className={`p-4 border rounded-md mb-6 min-h-37.5 bg-gray-800 flex flex-col ${
        isOver ? "bg-gray-700" : ""
      }`}
    >
      <h2 className="text-xl font-bold mb-2">{column.title}</h2>

      {sButton("green", "New Card", false, "mb-2", () => addCard(column.id))}

      <SortableContext
        items={column.cards.map((c: CardInterface) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 flex flex-col gap-2 min-h-25">
          {!hasCards && (
            <div className="text-gray-400 italic text-center py-6 border-dashed border-2 border-gray-600 rounded">
              Drop cards here
            </div>
          )}

          {column.cards.map((card: any) => (
            <Card
              key={card.id}
              card={card}
              col={column}
              editCard={editCard}
              removeCard={removeCard}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default Column;
