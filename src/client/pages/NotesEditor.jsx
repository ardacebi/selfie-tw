import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import fetchNoteData from "../data_fetching/fetchNoteData";
import patchNoteData from "../data_creation/patchNoteData";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CurrentDateContext } from "../contexts/CurrentDateContext";
import { marked } from "marked";
import { ThemeContext } from "../contexts/ThemeContext";
import { FaExclamationCircle } from "react-icons/fa";
import commonStyles from "../styles/commonStyles";
import AnimatedBackButton from "../components/AnimatedBackButton";

const NotesEditor = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { noteID } = useParams();
  const { currentUser } = useContext(CurrentUserContext);
  const { currentDate } = useContext(CurrentDateContext);

  const [viewButtonHover, setViewButtonHover] = useState(false);
  const [saveButtonHover, setSaveButtonHover] = useState(false);
  const [editButtonHover, setEditButtonHover] = useState(false);

  const [error, setError] = useState("");
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  const [editMode, setEditMode] = useState(true);
  const [editedBody, setEditedBody] = useState("");
  const [editedTitle, setEditedTitle] = useState("");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

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
    <div style={commonStyles.notes.editor.container(isMobile)}>
      {showErrorBanner && (
        <div
          style={commonStyles.getBannerStyle(
            "errorBannerStyle",
            showErrorBanner,
            theme,
          )}
        >
          <FaExclamationCircle style={commonStyles.bannerIconStyle} />
          <span>{error}</span>
        </div>
      )}

      {noteData ? (
        <div>
          <div
            style={{
              maxWidth: "450px",
              margin: "0 auto",
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: "5px",
              boxSizing: "border-box",
            }}
          >
            <AnimatedBackButton to="/notes" text="Back to Notes" />
          </div>

          {editMode ? (
            <div>
              <div>
                <button
                  onMouseEnter={() => setViewButtonHover(true)}
                  onMouseLeave={() => setViewButtonHover(false)}
                  style={commonStyles.notes.noteEditButton(
                    theme,
                    viewButtonHover,
                  )}
                  onClick={() => {
                    setEditMode(false);
                    setSaveButtonHover(false);
                    setViewButtonHover(false);
                  }}
                >
                  View Mode
                </button>
                <button
                  onMouseEnter={() => setSaveButtonHover(true)}
                  onMouseLeave={() => setSaveButtonHover(false)}
                  style={commonStyles.notes.noteEditButton(
                    theme,
                    saveButtonHover,
                  )}
                  onClick={() => {
                    patchNote.mutate({
                      noteID: noteID,
                      title: editedTitle,
                      body: editedBody,
                      lastModifiedDate: currentDate,
                      creationDate: noteData.data.creationDate,
                    });
                    refetchNote();
                    setSaveButtonHover(false);
                    setViewButtonHover(false);
                  }}
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
              <button
                onMouseEnter={() => setEditButtonHover(true)}
                onMouseLeave={() => setEditButtonHover(false)}
                style={commonStyles.notes.editor.noteEditButton(
                  theme,
                  editButtonHover,
                )}
                onClick={() => {
                  setEditMode(true);
                  setEditButtonHover(false);
                }}
              >
                Edit
              </button>
              <h1 style={commonStyles.notes.editor.noteTitle(isMobile)}>
                {editedTitle}
              </h1>
              <div style={commonStyles.notes.editor.noteDates(theme)}>
                <p>
                  Last edited:{" "}
                  {new Date(noteData.data.lastModifiedDate).toLocaleString()}
                </p>
                <p>
                  Created at:{" "}
                  {new Date(noteData.data.creationDate).toLocaleString()}
                </p>
              </div>
              <div
                style={commonStyles.notes.editor.noteBody(isMobile)}
                dangerouslySetInnerHTML={{
                  __html: marked.parse(editedBody || ""),
                }}
              ></div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading note...</p>
      )}
    </div>
  );
};

export default NotesEditor;
