import { useEffect } from "react";
import { useApiMutation } from "../helpers/apiMutation";
import type { BoardInterface } from "../helpers/interfaces";

export function useBoards() {
  const {
    state: boards,
    setState: setBoards,
    mutate,
  } = useApiMutation<BoardInterface[]>([]);

  useEffect(() => {
    getBoards(setBoards);
  }, []);

  function addBoard() {
    const tempId = crypto.randomUUID();

    mutate({
      optimisticUpdate: (boards) => [
        ...boards,
        {
          id: tempId,
          title: "New Board",
          columns: [],
          user_id: "",
          created_at: "",
          updated_at: "",
        },
      ],
      rollback: (boards) => boards.filter((b) => b.id !== tempId),
      apiCall: async () => {
        const real = await createBoard();
        if (!real) throw new Error("fail");

        setBoards((boards) => boards.map((b) => (b.id === tempId ? real : b)));
      },
    });
  }

  function removeBoard(id: string) {
    mutate({
      optimisticUpdate: (boards) => boards.filter((b) => b.id !== id),
      apiCall: () => deleteBoard(id),
    });
  }

  return { boards, addBoard, removeBoard };
}

async function getBoards(setBoards: Function) {
  try {
    const res = await fetch("http://localhost:8080/api/boards", {
      credentials: "include",
    });

    if (!res.ok) return;

    const json = await res.json();

    setBoards(Array.isArray(json) ? json : (json.boards ?? []));
  } catch (err) {
    console.log(err);
  }
}

async function createBoard() {
  try {
    const res = await fetch(`http://localhost:8080/api/board`, {
      credentials: "include",
      method: "post",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function deleteBoard(id: string) {
  try {
    const res = await fetch(`http://localhost:8080/api/board?board_id=${id}`, {
      credentials: "include",
      method: "delete",
    });

    return res.ok;
  } catch (err) {
    console.log(err);
    return false;
  }
}
