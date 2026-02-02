import { useEffect, useState } from "react";
import type { BoardInterface } from "../helpers/interfaces";
import { API_BASE } from "../helpers/consts";

/* ============================
   Hook
============================ */

export function useBoards() {
  const [boards, setBoards] = useState<BoardInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load boards on mount
  useEffect(() => {
    loadBoards();
  }, []);

  /* ============================
     Board actions
  ============================ */

  async function loadBoards() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/boards`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch boards");

      const json = await res.json();
      setBoards(Array.isArray(json) ? json : (json.boards ?? []));
    } catch (err) {
      console.error(err);
      setError("Failed to load boards");
    } finally {
      setLoading(false);
    }
  }

  async function addBoard() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/board`, {
        credentials: "include",
        method: "POST",
      });

      if (!res.ok) throw new Error("Failed to create board");

      const newBoard: BoardInterface = await res.json();
      setBoards((prev) => [...prev, newBoard]);
    } catch (err) {
      console.error(err);
      setError("Failed to create board");
    } finally {
      setLoading(false);
    }
  }

  async function removeBoard(id: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/board?board_id=${id}`, {
        credentials: "include",
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete board");

      setBoards((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete board");
    } finally {
      setLoading(false);
    }
  }

  async function editBoard(id: string, title: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/board?board_id=${id}`, {
        credentials: "include",
        method: "PUT",
        body: JSON.stringify({ title: title }),
      });

      if (!res.ok) throw new Error("Failed to edit board");

      // setBoards((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to edit board");
    } finally {
      setLoading(false);
    }
  }

  return {
    boards,
    loading,
    error,
    addBoard,
    removeBoard,
    editBoard,
    reloadBoards: loadBoards,
  };
}
