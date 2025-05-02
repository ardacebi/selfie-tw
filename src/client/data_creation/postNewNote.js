async function postNewNote({ title, creationDate, lastModifiedDate, body, userID }) {
  
    if (userID === null) {
      throw new Error("User not found");
    } else {
      const res = await fetch(`/api/notes/create_note/${userID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, creationDate, lastModifiedDate, body }),
      });
  
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(`${message}`);
      }
  
      return res.json();
    }
  }
  
  export default postNewNote;
  