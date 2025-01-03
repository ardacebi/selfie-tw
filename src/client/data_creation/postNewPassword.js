async function postNewPassword({ email, password }) {

  const IDres = await fetch("http://localhost:5000/api/account/find_user_id_by_email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })

  if(!IDres.ok){
    throw new Error('Error finding user ID');
  }

  const { userID } = await IDres.json();
  
  if (userID === null) {
    throw new Error('User not found');
  }
  else{
    const res = await fetch(`http://localhost:5000/api/account/change_password/${userID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!res.ok) {
      throw new Error(`Can't change password`);
    }
  
    return res.json();
  }
}

export default postNewPassword;