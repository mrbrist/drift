import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { sButton } from "./smallButton";

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
        className="cursor-grab text-amber-300 font-semibold select-none"
      >
        ☰ {card.position}
      </div>
      <span className="text-slate-500 block pb-3">{card.id}</span>
      <span className="text-amber-100 block pb-3">{card.title}</span>
      {sButton("blue", "Update Card", false, "", () =>
        editCard(col.id, card.id, {
          title: "bob",
        }),
      )}
      {sButton("red", "Delete Card", false, "", () =>
        removeCard(col.id, card.id),
      )}
    </div>
  );
}

export default Card;
