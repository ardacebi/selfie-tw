async function fetchNoteData({ noteID, userID }) {
  if (noteID === null) {
    throw new Error("Provide a noteID");
  } else if (userID === null) {
    throw new Error("Provide a userID");
  } else {
    const res1 = await fetch(`/api/account/user_owns_note`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ noteID, userID }),
    });

    if (!res1.ok) {
      const { message } = await res1.json();
      throw new Error(`${message}`);
    } else {
      const res2 = await fetch(`/api/notes/get_note_by_id`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteID }),
      });

      if (!res2.ok) {
        const { message } = await res2.json();
        throw new Error(`${message}`);
      }

      return res2.json();
    }
  }
}

export default fetchNoteData;
