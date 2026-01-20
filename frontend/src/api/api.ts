import type { NavigateFunction } from "react-router-dom";
import type { BoardInterface, CardInterface } from "../helpers/interfaces";

async function checkIfLoggedIn(
  nav: NavigateFunction,
  onLoggedIn: string,
  onLoggedOut: string,
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

async function createCard(
  board_id: string,
  col_id: string,
): Promise<CardInterface | null> {
  try {
    const res = await fetch(
      `http://localhost:8080/api/card?board_id=${board_id}`,
      {
        credentials: "include",
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: col_id,
          title: "New Card",
        }),
      },
    );

    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    console.log(err);
    return null;
  }
}

async function deleteCard(board_id: string, card_id: string) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/card?board_id=${board_id}`,
      {
        credentials: "include",
        method: "delete",
        body: JSON.stringify({ id: card_id }),
      },
    );

    return res.ok;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateCard(
  board_id: string,
  card_id: string,
  col_id: string,
  updates: Partial<CardInterface>,
) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/card?board_id=${board_id}`,
      {
        credentials: "include",
        method: "put",
        body: JSON.stringify(
          Object.assign(
            {
              id: card_id,
              column_id: col_id,
              position: 100.000000000066,
            },
            updates,
          ),
        ),
      },
    );

    if (!res.ok) return null;

    return await res.json();
  } catch (err) {
    console.log(err);
    return null;
  }
}

export {
  checkIfLoggedIn,
  handleLogout,
  getUserData,
  getBoard,
  createCard,
  deleteCard,
  updateCard,
};
