async function fetchNoteData({ noteID }) {
  if (userID === null) {
    throw new Error("User not found");
  } else {
    const res = await fetch(`/api/notes/get_note_by_id`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ noteID }),
    });

    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(`${message}`);
    }

    return res.json();
  }
}

export default fetchNoteData;
