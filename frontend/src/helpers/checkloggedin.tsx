import type { NavigateFunction } from "react-router-dom";

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

export default checkIfLoggedIn;
