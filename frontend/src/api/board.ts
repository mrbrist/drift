import { useEffect, useState } from "react";
import { getBoard, createCard, deleteCard, updateCard } from "./api";
import type {
  BoardInterface,
  CardInterface,
  ColumnInterface,
} from "../helpers/interfaces";

export function useBoard(boardId?: string) {
  const [board, setBoard] = useState<BoardInterface | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load board when boardId changes
  useEffect(() => {
    if (!boardId) return;

    setLoading(true);
    setError(null);

    getBoard(boardId)
      .then((data) => setBoard(data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load board");
      })
      .finally(() => setLoading(false));
  }, [boardId]);

  // Add a card (waits for server response)
  async function addCard(columnId: string) {
    if (!board) return;

    setLoading(true);
    setError(null);

    try {
      const newCard: CardInterface | null = await createCard(
        board.id,
        columnId,
      );
      if (!newCard) throw new Error("Failed to create card");

      setBoard((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === columnId
              ? { ...col, cards: [...col.cards, newCard] }
              : col,
          ),
        };
      });
    } catch (err) {
      console.error(err);
      setError("Failed to add card");
    } finally {
      setLoading(false);
    }
  }

  // Delete a card (waits for server response)
  async function removeCard(columnId: string, cardId: string) {
    if (!board) return;

    setLoading(true);
    setError(null);

    try {
      const success: boolean = await deleteCard(board.id, cardId);
      if (!success) throw new Error("Failed to delete card");

      setBoard((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === columnId
              ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
              : col,
          ),
        };
      });
    } catch (err) {
      console.error(err);
      setError("Failed to delete card");
    } finally {
      setLoading(false);
    }
  }

  // Update a card (waits for server response)
  async function editCard(
    columnId: string,
    cardId: string,
    updates: Partial<CardInterface>,
  ) {
    if (!board) return;

    setLoading(true);
    setError(null);

    try {
      const updatedCard: CardInterface | null = await await updateCard(
        board.id,
        cardId,
        columnId,
        updates,
      );
      if (!updatedCard) throw new Error("Failed to update card");

      setBoard((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === columnId
              ? {
                  ...col,
                  cards: col.cards.map((c) =>
                    c.id === cardId ? { ...c, ...updates } : c,
                  ),
                }
              : col,
          ),
        };
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
    setBoard,
    addCard,
    removeCard,
    editCard,
  };
}
