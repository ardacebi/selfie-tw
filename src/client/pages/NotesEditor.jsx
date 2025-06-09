import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import fetchNoteData from "../data_fetching/fetchNoteData";
import patchNoteData from "../data_creation/patchNoteData";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CurrentDateContext } from "../contexts/CurrentDateContext";
import { marked } from "marked";

const NotesEditor = () => {
  const navigate = useNavigate();
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

  const patchNote = useMutation(patchNoteData, {
    onMutate: () => setShowErrorBanner(false),
    onSuccess: () => {
      refetchNote();
      setEditMode(false);
    },
    onError: (err) => {
      setError(err.message);
      setShowErrorBanner(true);
    },
  });

  return (
    <div>
      {showErrorBanner && (
        <div>
          <p>{error}</p>
        </div>
      )}

      {noteData ? (
        <div>
          <button onClick={() => navigate("/notes")}>Back to Notes </button>
          {editMode ? (
            <div>
              <div>
                <button
                  onClick={() => {
                    setEditMode(false);
                    patchNote.mutate({
                      noteID: noteID,
                      title: editedTitle,
                      body: editedBody,
                      lastModifiedDate: currentDate,
                      creationDate: noteData.data.creationDate,
                    });
                  }}
                >
                  View Mode
                </button>
                <button
                  onClick={() =>
                    patchNote.mutate({
                      noteID: noteID,
                      title: editedTitle,
                      body: editedBody,
                      lastModifiedDate: currentDate,
                      creationDate: noteData.data.creationDate,
                    })
                  }
                >
                  Save
                </button>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => {
                    setEditedTitle(e.target.value);
                  }}
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
