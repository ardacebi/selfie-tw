async function fetchLoginData({ queryKey }) {
  const { username, password } = queryKey[1];
  const res = await fetch("http://localhost:3000/api/login", {
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
