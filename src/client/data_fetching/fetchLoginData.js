async function fetchLoginData({ username, password }) {
  const res = await fetch("http://localhost:5000/api/account/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error(`No user found with this username or password`);
  }

  return res.json();
}

export default fetchLoginData;
