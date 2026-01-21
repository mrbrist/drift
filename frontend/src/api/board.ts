import { useEffect, useState } from "react";
import { getBoard, createCard, deleteCard, updateCard } from "./api";
import type { BoardInterface, CardInterface } from "../helpers/interfaces";

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
      .then((data) => setBoard(sortBoard(data)))
      .catch((err) => {
        console.error(err);
        setError("Failed to load board");
      })
      .finally(() => setLoading(false));
  }, [boardId]);

  function sortBoard(board: BoardInterface | null): BoardInterface | null {
    if (!board) return null;
    return {
      ...board,
      columns: board.columns.map((col) => ({
        ...col,
        cards: [...col.cards].sort((a, b) => a.position - b.position),
      })),
    };
  }

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

        const updatedBoard = {
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === columnId
              ? { ...col, cards: [...col.cards, newCard] }
              : col,
          ),
        };
        return sortBoard(updatedBoard);
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

        const updatedBoard = {
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === columnId
              ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
              : col,
          ),
        };
        return sortBoard(updatedBoard);
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

        const updatedBoard = {
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
        return sortBoard(updatedBoard);
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
  };
}
