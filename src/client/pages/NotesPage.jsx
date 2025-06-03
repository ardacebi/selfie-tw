import { useContext, useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
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
  const [error, setError] = useState(null);
  const [hoveredNoteId, setHoveredNoteId] = useState(null);
  const [newNoteHover, setNewNoteHover] = useState(false);

  const fetchNotes = useMutation(fetchAllNotesData, {
    onSuccess: (res) => {
      setAllNotes(res.data);
      setError(null); // Clear any previous errors
    },
    onError: (error) => {
      setError(error.message);
      setAllNotes([]); // Clear notes on error
    },
  });

  useEffect(() => {
    if (currentUser) {
      fetchNotes.mutate({ userID: currentUser });
    }
  }, [currentUser]);

  return (
    <div>
      <div style={commonStyles.notes.titleWrapper}>
        <h1>Notes</h1>
      </div>

      <button 
      onMouseEnter={() => setNewNoteHover(true)}
      onMouseLeave={() => setNewNoteHover(false)}
      style={{
        ...commonStyles.notes.newNoteButton(theme),
        ...(newNoteHover
        ? commonStyles.notes.newNoteButtonHover(theme)
        : {}),
        }}
      >
        New Note
      </button>
      

      <div style={commonStyles.notes.notesPage}>
        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
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
              Created on: {new Date(note.creationDate).toLocaleDateString()} | Last modified:{" "}
              {new Date(note.lastModifiedDate).toLocaleDateString()}
            </p>
            <div dangerouslySetInnerHTML={{
              __html: note.HTMLbody.length > 120
              ? note.HTMLbody.substring(0, 120) + "..."
              : note.HTMLbody
            }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
