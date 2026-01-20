import { useEffect, useState } from "react";
// import { updateCard, createCard, deleteCard } from "../helpers/api";
import type { BoardInterface } from "../helpers/interfaces";

export function useBoard(boardId?: string) {
  const [board, setBoard] = useState<BoardInterface | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!boardId) return;

    setLoading(true);
    getBoard(boardId).then((data) => {
      setBoard(data);
      setLoading(false);
    });
  }, [boardId]);

  return { board, loading };
}

async function getBoard(id: string): Promise<BoardInterface | null> {
  try {
    const res = await fetch(`http://localhost:8080/api/board?board_id=${id}`, {
      credentials: "include",
      method: "get",
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    console.log(err);
    return null;
  }
}
