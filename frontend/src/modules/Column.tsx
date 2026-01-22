import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Card from "./Card";
import { sButton } from "./smallButton";

function Column({ column, addCard, editCard, removeCard }: any) {
  return (
    <div className="p-4 border rounded-md mb-6">
      <h2 className="text-xl font-bold mb-2">{column.title}</h2>

      {sButton("green", "New Card", false, "", () => addCard(column.id))}

      <SortableContext
        items={column.cards}
        strategy={verticalListSortingStrategy}
      >
        {column.cards.map((card: any) => (
          <Card
            key={card.id}
            card={card}
            col={column}
            editCard={editCard}
            removeCard={removeCard}
          />
        ))}
      </SortableContext>
    </div>
  );
}

export default Column;
