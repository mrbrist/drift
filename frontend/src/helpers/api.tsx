import type { NavigateFunction } from "react-router-dom";
import type { BoardInterface } from "./interfaces";

async function checkIfLoggedIn(
  nav: NavigateFunction,
  onLoggedIn: string,
  onLoggedOut: string
) {
  try {
    const res = await fetch("http://localhost:8080/api/protected", {
      credentials: "include",
    });

    if (res.ok) {
      nav(onLoggedIn, { replace: true });
    } else {
      nav(onLoggedOut, { replace: true });
    }
  } catch (err) {
    nav(onLoggedOut, { replace: true });
  }
}

function handleLogout(navigate: NavigateFunction) {
  fetch("http://localhost:8080/api/logout", {
    credentials: "include",
  }).then(() => {
    checkIfLoggedIn(navigate, "/app", "/login");
  });
}

async function getUserData(setUserData: Function) {
  try {
    const res = await fetch("http://localhost:8080/api/getUser", {
      credentials: "include",
    });

    if (res.ok) {
      let json = await res.json();
      setUserData(json);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getBoards(setBoards: Function) {
  try {
    const res = await fetch("http://localhost:8080/api/boards", {
      credentials: "include",
      method: "get",
    });

    if (res.ok) {
      let json = await res.json();
      setBoards(json);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getBoard(id: string): Promise<BoardInterface | null> {
  try {
    const res = await fetch(`http://localhost:8080/api/board?id=${id}`, {
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

async function createBoard() {
  try {
    const res = await fetch("http://localhost:8080/api/board", {
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
    const res = await fetch(`http://localhost:8080/api/board?id=${id}`, {
      credentials: "include",
      method: "delete",
    });

    return res.ok;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export {
  checkIfLoggedIn,
  handleLogout,
  getUserData,
  getBoards,
  getBoard,
  createBoard,
  deleteBoard,
};
