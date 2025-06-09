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

  const [editMode, setEditMode] = useState(true);
  const [editedBody, setEditedBody] = useState("");
  const [editedTitle, setEditedTitle] = useState("");

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

  useEffect(() => {
    setEditMode(true);
  }, [noteID]);

  useEffect(() => {
    if (noteData && noteData.data) {
      setEditedBody(noteData.data.body);
      setEditedTitle(noteData.data.title);
    }
  }, [noteData]);

  return (
    <div>
      {showErrorBanner && (
        <div>
          <p>{error}</p>
        </div>
      )}


      {noteData ? (
        <div>
          
          {editMode ? (
            <div>
            <div>
              <button onClick={() => setEditMode(false)}>View Mode</button>
              <button>Save</button>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </div>
            <textarea
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              rows="10"
              cols="50"
            />
            </div>
          ) : (
            <div>
              <button onClick={() => setEditMode(true)}>Edit</button>
              <h1>{noteData.data.title}</h1>
            <div
              dangerouslySetInnerHTML={{
                __html: marked.parse(noteData?.data.body || ""),
              }}
            ></div>
            </div>
         )}


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
