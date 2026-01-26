import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { iButton } from "./iconButton";
import { GripHorizontal } from "lucide-react";

function Card({ card, col, editCard, removeCard }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: card.id,
      data: {
        columnId: col.id,
      },
    });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="mb-3 border border-slate-500 rounded-md"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div
        {...listeners}
        className="cursor-grab select-none flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-t-md p-2 transition-colors"
        title="Drag to move"
      >
        <GripHorizontal className="w-5" />
      </div>

      <span className="text-amber-100 block pt-2 pb-3">{card.title}</span>

      <div className="flex flex-row justify-between mr-3">
        {iButton("blue", "edit", false, "", () =>
          editCard(col.id, card.id, {
            title: "bob",
          }),
        )}
        <span className="text-slate-600 italic text-xs style block pt-2 pb-3">
          {card.id.split("-")[4]}
        </span>
        {iButton("red", "trash", false, "", () => removeCard(col.id, card.id))}
      </div>
    </div>
  );
}

export default Card;
