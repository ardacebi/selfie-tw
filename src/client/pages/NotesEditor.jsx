import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import fetchNoteData from "../data_fetching/fetchNoteData";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CurrentDateContext } from "../contexts/CurrentDateContext";
import { marked } from "marked";

const NotesEditor = () => {
  const { noteID } = useParams();
  const { currentUser } = useContext(CurrentUserContext);
  const { currentDate } = useContext(CurrentDateContext);

  const [error, setError] = useState("");
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  const { data: noteData, refetch: refetchNote } = useQuery(
    ["noteData", noteID],
    () => fetchNoteData({ noteID: noteID, userID: currentUser }),
    {
      enabled: !!currentUser && !!noteID,
      onError: (err) => {
        setError(err.message);
        setShowErrorBanner(true);
      },
    },
  );

  return (
    <div>
      {showErrorBanner && (
        <div>
          <p>{error}</p>
        </div>
      )}
      {console.log("Note Data:", noteData)}
      {noteData ? (
        <div>
          <h1>{noteData.data.title}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: marked.parse(noteData.data.body || ""),
            }}
          ></div>
          <p>
            Last edited:{" "}
            {new Date(noteData.data.lastModifiedDate).toLocaleString()}
          </p>
          <p>
            Created at: {new Date(noteData.data.creationDate).toLocaleString()}
          </p>
        </div>
      ) : (
        <p>Loading note...</p>
      )}
    </div>
  );
};

export default NotesEditor;
