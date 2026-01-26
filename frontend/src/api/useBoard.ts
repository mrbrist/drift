import { useEffect, useState } from "react";
import type { BoardInterface, CardInterface } from "../helpers/interfaces";
import { API_BASE } from "../helpers/consts";

/* ============================
   Hook
============================ */

export function useBoard(boardId?: string) {
  const [board, setBoard] = useState<BoardInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load board
  useEffect(() => {
    if (!boardId) return;
    loadBoard(boardId);
  }, [boardId]);

  async function loadBoard(id: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/board?board_id=${id}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch board");

      const data: BoardInterface = await res.json();
      setBoard(sortBoard(data));
    } catch (err) {
      console.error(err);
      setError("Failed to load board");
    } finally {
      setLoading(false);
    }
  }

  /* ============================
     Card actions
  ============================ */

  async function addCard(columnId: string) {
    if (!board) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/card?board_id=${board.id}`, {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: columnId,
          title: "New Card",
        }),
      });

      if (!res.ok) throw new Error("Failed to create card");

      const newCard: CardInterface = await res.json();

      setBoard((prev) =>
        prev
          ? sortBoard({
              ...prev,
              columns: prev.columns.map((col) =>
                col.id === columnId
                  ? { ...col, cards: [...col.cards, newCard] }
                  : col,
              ),
            })
          : prev,
      );
    } catch (err) {
      console.error(err);
      setError("Failed to add card");
    } finally {
      setLoading(false);
    }
  }

  async function removeCard(columnId: string, cardId: string) {
    if (!board) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/card?board_id=${board.id}`, {
        credentials: "include",
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: cardId }),
      });

      if (!res.ok) throw new Error("Failed to delete card");

      setBoard((prev) =>
        prev
          ? sortBoard({
              ...prev,
              columns: prev.columns.map((col) =>
                col.id === columnId
                  ? {
                      ...col,
                      cards: col.cards.filter((c) => c.id !== cardId),
                    }
                  : col,
              ),
            })
          : prev,
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete card");
    } finally {
      setLoading(false);
    }
  }

  async function editCard(
    _columnId: string, // no longer trusted
    cardId: string,
    updates: Partial<CardInterface>,
  ) {
    if (!board) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/card?board_id=${board.id}`, {
        credentials: "include",
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cardId,
          ...updates,
        }),
      });

      if (!res.ok) throw new Error("Failed to update card");

      const updatedCard: CardInterface = await res.json();

      setBoard((prev) => {
        if (!prev) return prev;

        return sortBoard({
          ...prev,
          columns: prev.columns.map((col) => {
            // remove from all columns first
            const filteredCards = col.cards.filter((c) => c.id !== cardId);

            // insert into new column
            if (col.id === updatedCard.column_id) {
              return {
                ...col,
                cards: [...filteredCards, updatedCard],
              };
            }

            return {
              ...col,
              cards: filteredCards,
            };
          }),
        });
      });
    } catch (err) {
      console.error(err);
      setError("Failed to update card");
    } finally {
      setLoading(false);
    }
  }

  return {
    board,
    loading,
    error,
    addCard,
    removeCard,
    editCard,
    reloadBoard: () => boardId && loadBoard(boardId),
  };
}

/* ============================
   Helpers
============================ */

function sortBoard(board: BoardInterface): BoardInterface {
  return {
    ...board,
    columns: board.columns.map((col) => ({
      ...col,
      cards: [...col.cards].sort((a, b) => a.position - b.position),
    })),
  };
}
