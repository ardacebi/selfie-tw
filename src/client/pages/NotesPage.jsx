import { useContext, useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CurrentDateContext } from "../contexts/CurrentDateContext";
import { ThemeContext } from "../contexts/ThemeContext";
import {
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaSearch,
  FaSearchMinus,
  FaSearchPlus,
} from "react-icons/fa";
import commonStyles from "../styles/commonStyles";
import postNewNote from "../data_creation/postNewNote";
import fetchAllNotesData from "../data_fetching/fetchAllNotesData";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { set } from "mongoose";
import FormInput from "../components/FormInput";
import { FaExclamationCircle } from "react-icons/fa";

const NotesPage = () => {
  const { theme } = useContext(ThemeContext);
  const { currentDate } = useContext(CurrentDateContext);
  const [markdown, setMarkdown] = useState("");
  const [previewHtml, setPreviewHtml] = useState("");

  /*
  const login = useMutation(fetchLoginData, {
    onMutate: () => setShowErrorBanner(false),
    onSuccess: (res) => {
      setCurrentUser(res.data._id);
      if (rememberMe) localStorage.setItem("savedUser", res.data._id);
      navigate("/", { replace: true });
    },
    onError: (err) => {
      setError(err.message);
      setShowErrorBanner(true);
    },
  });

  // Markdown gets converted to HTML using marked.js and sanitized with DOMPurify
  const handleMarkdownChange = (e) => {
    setMarkdown(e.target.value);
    const rawHTML = marked.parse(e.target.value);
    const cleanedHTML = DOMPurify.sanitize(rawHTML);
    setPreviewHtml(cleanedHTML);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    login.mutate({
      username: formData.get("username") ?? "",
      password: formData.get("password") ?? "",
    });
  };
  */

  const { currentUser } = useContext(CurrentUserContext);
  const [allNotes, setAllNotes] = useState([]);

  // Hover states for notes and buttons
  const [hoveredNoteId, setHoveredNoteId] = useState(null);
  const [newNoteHover, setNewNoteHover] = useState(false);
  const [createNoteHover, setCreateNoteHover] = useState(false);
  const [cancelNoteHover, setCancelNoteHover] = useState(false);

  const [showNewNoteForm, setShowNewNoteForm] = useState(false);

  const [error, setError] = useState("");
  const [showErrorBanner, setShowErrorBanner] = useState(false);

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

  const { data: notesData, refetch: refetchNotes } = useQuery(
    ["notes", currentUser],
    () => fetchAllNotesData({ userID: currentUser }),
    { enabled: !!currentUser },
  );

  useEffect(() => {
    if (notesData) {
      setAllNotes(notesData.data);
    }
  }, [notesData]);

  const postNote = useMutation(postNewNote, {
    onMutate: () => setShowErrorBanner(false),
    onSuccess: (res) => {
      setShowNewNoteForm(false);
      refetchNotes();
    },
    onError: (err) => {
      setError(err.message);
      setShowErrorBanner(true);
    },
  });

  const handleNewNoteSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const title = formData.get("title");
      postNote.mutate({
        title: title,
        body: " ",
        userID: currentUser,
      });
    } catch (err) {
      setError(err.message);
      setShowErrorBanner(true);
    }
  };

  return (
    <div>
      <div style={commonStyles.notes.titleWrapper}>
        <h1>Notes</h1>
      </div>

      {!showNewNoteForm && (
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

      <button
        onClick={() => setShowNewNoteForm(true)}
        onMouseEnter={() => setNewNoteHover(true)}
        onMouseLeave={() => setNewNoteHover(false)}
        style={{
          ...commonStyles.notes.newNoteButton(
            theme,
            isMobile || allNotes.length === 0, //If there are no notes, make the button full width
          ),
          ...(newNoteHover ? commonStyles.notes.noteButtonHover(theme) : {}),
        }}
      >
        New Note
      </button>

      {showNewNoteForm && (
        <div style={commonStyles.notes.newNoteFormOverlay}>
          <div style={commonStyles.notes.newNoteFormContainer(theme)}>
            <form onSubmit={handleNewNoteSubmit}>
              <FormInput
                name="title"
                placeholder="Title"
                required={true}
                maxLength="25"
              />
              <div style={{ marginTop: "10px" }}>
                <button
                  type="submit"
                  onMouseEnter={() => setCreateNoteHover(true)}
                  onMouseLeave={() => setCreateNoteHover(false)}
                  style={{
                    ...commonStyles.notes.createNoteButton(theme, false),
                    ...(createNoteHover
                      ? commonStyles.notes.noteButtonHover(theme)
                      : {}),
                  }}
                >
                  Create Note
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewNoteForm(false);
                    setCancelNoteHover(false);
                    setCreateNoteHover(false);
                    setShowErrorBanner(false);
                    setError("");
                  }}
                  onMouseEnter={() => setCancelNoteHover(true)}
                  onMouseLeave={() => setCancelNoteHover(false)}
                  style={{
                    ...commonStyles.notes.cancelNoteButton(theme),
                    ...(cancelNoteHover
                      ? commonStyles.notes.noteButtonHover(theme)
                      : {}),
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>

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
          </div>
        </div>
      )}

      {allNotes.length === 0 && (
        <div>
          <p>There are no Notes at the moment!</p>
        </div>
      )}

      <div style={commonStyles.notes.notesPage(isMobile)}>
        {allNotes.map((note) => (
          <div
            key={note._id}
            onMouseEnter={() => setHoveredNoteId(note._id)}
            onMouseLeave={() => setHoveredNoteId(null)}
            style={{
              ...commonStyles.notes.noteItem(theme),
              ...(hoveredNoteId === note._id
                ? commonStyles.notes.noteItemHover
                : {}),
            }}
          >
            <h2>{note.title}</h2>
            <p style={commonStyles.notes.notesDate(theme)}>
              Created on: {new Date(note.creationDate).toLocaleDateString()} |
              Last modified:{" "}
              {new Date(note.lastModifiedDate).toLocaleDateString()}
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  note.HTMLbody.length > 120
                    ? note.HTMLbody.substring(0, 120) + "..."
                    : note.HTMLbody,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
