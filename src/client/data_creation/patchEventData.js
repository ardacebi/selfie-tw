async function patchEventData({
  title,
  description,
  date,
  duration,
  location,
  type,
  frequencyType,
  frequencyWeekDays,
  repetition,
  eventID,
  userID,
}) {
  if (!eventID) {
    throw new Error("Event ID is required");
  } else if (!userID) {
    throw new Error("User not found");
  } else if (!title || !description || !date || !type) {
    throw new Error("you need the essential parameters to update an event");
  } else {
    const res = await fetch(`/api/events/update_event/${eventID}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        date,
        duration,
        location,
        type,
        frequencyType,
        frequencyWeekDays,
        repetition,
        userID,
      }),
    });

    if (!res.ok) {
      const { message } = await res.json();
      throw new Error(`${message}`);
    }

    return res.json();
  }
}

export default patchEventData;
