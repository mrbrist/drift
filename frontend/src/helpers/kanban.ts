import { createBoard } from "../api/api";
import type { BoardsInterface } from "./interfaces";
import type { Dispatch, SetStateAction } from "react";

async function handleCreateBoard(
  setBoards: Dispatch<SetStateAction<BoardsInterface>>,
) {
  const newBoard = await createBoard();

  if (newBoard) {
    setBoards((prev) => [...(prev || []), newBoard]);
  }
}

export { handleCreateBoard };
