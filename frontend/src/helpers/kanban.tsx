async function getUserData(setUserData: Function) {
  try {
    const res = await fetch("http://localhost:8080/api/app", {
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

export default getUserData;
