async function patchNoteData({
  noteID,
  title,
  lastModifiedDate,
  creationDate,
  body,
}) {
  if (noteID === null) {
    throw new Error("Note ID is required");
  } else if (!title || !lastModifiedDate || !creationDate || !body) {
    throw new Error("All fields are required");
  } else {
    const res = await fetch(`/api/notes/update_note/${noteID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, lastModifiedDate, creationDate, body }),
    });

    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(`${message}`);
    }

    return res.json();
  }
}

export default patchNoteData;
