import type { NavigateFunction } from "react-router-dom";
import { API_BASE } from "./consts";

async function checkIfLoggedIn(
  nav: NavigateFunction,
  onLoggedIn: string,
  onLoggedOut: string,
) {
  try {
    const res = await fetch(`${API_BASE}/protected`, {
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
  fetch(`${API_BASE}/logout`, {
    credentials: "include",
  }).then(() => {
    checkIfLoggedIn(navigate, "/app", "/login");
  });
}

async function getUserData(setUserData: Function) {
  try {
    const res = await fetch(`${API_BASE}/getUser`, {
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

export { checkIfLoggedIn, handleLogout, getUserData };
