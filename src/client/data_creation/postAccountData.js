async function postAccountData({ username, password }) {
    const res = await fetch("http://localhost:5000/api/account/sign_up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (!res.ok) {
      throw new Error(`New User creation error`);
    }
  
    return res.json();
  }
  
  export default postAccountData;
  