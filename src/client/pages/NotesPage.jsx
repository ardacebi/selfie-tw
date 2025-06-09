import { useContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { marked } from "marked";
import { ThemeContext } from "../contexts/ThemeContext";
import commonStyles from "../styles/commonStyles";
import postNewNote from "../data_creation/postNewNote";
import fetchAllNotesData from "../data_fetching/fetchAllNotesData";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CurrentDateContext } from "../contexts/CurrentDateContext";
import FormInput from "../components/FormInput";
import { FaExclamationCircle } from "react-icons/fa";

const NotesPage = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const { currentDate } = useContext(CurrentDateContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [allNotes, setAllNotes] = useState([]);
  const [noteSorting, setNoteSorting] = useState("alphabetical");
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Hover states for notes and buttons
  const [hoveredNoteId, setHoveredNoteId] = useState(null);
  const [newNoteHover, setNewNoteHover] = useState(false);
  const [createNoteHover, setCreateNoteHover] = useState(false);
  const [cancelNoteHover, setCancelNoteHover] = useState(false);
  const [dropdownNoteHover, setDropdownNoteHover] = useState(false);

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
    ["userNotes", currentUser],
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
      const newNoteID = res.data._id;
      navigate(`/notes/${newNoteID}`);
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
        creationDate: currentDate,
        lastModifiedDate: currentDate,
        body: " ",
        userID: currentUser,
      });
    } catch (err) {
      setError(err.message);
      setShowErrorBanner(true);
    }
  };

  const sortedNotes = useMemo(() => {
    if (!allNotes || allNotes.length === 0) return [];
    else {
      return [...allNotes].sort((a, b) => {
        if (noteSorting === "alphabetical") {
          return a.title.localeCompare(b.title);
        } else if (noteSorting === "creationDate") {
          return new Date(b.creationDate) - new Date(a.creationDate);
        } else if (noteSorting === "lastModifiedDate") {
          return new Date(b.lastModifiedDate) - new Date(a.lastModifiedDate);
        }
      });
    }
  }, [allNotes, noteSorting]);

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
            isMobile || allNotes.length < 5, //If there are less then five notes, make the button big as it is visualized from mobile
          ),
          ...(newNoteHover ? commonStyles.notes.noteButtonHover(theme) : {}),
        }}
      >
        New Note
      </button>

      <div style={{ position: "relative", float: "right" }}>
        {allNotes.length > 0 && (
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            onMouseEnter={() => setDropdownNoteHover(true)}
            onMouseLeave={() => setDropdownNoteHover(false)}
            style={{
              ...commonStyles.notes.dropdownNoteButton(theme),
              ...(dropdownNoteHover
                ? commonStyles.notes.dropdownNoteButtonHover(theme)
                : {}),
            }}
          >
            {noteSorting === "alphabetical"
              ? "Alphabetical"
              : noteSorting === "creationDate"
                ? "Creation Date"
                : "Last Modified Date"}
          </button>
        )}

        {/* Dropdown Menu */}
        {allNotes.length > 0 && (
          <div
            style={{
              ...commonStyles.notes.dropdownMenuInactive(theme),
              ...(showSortDropdown
                ? commonStyles.notes.dropdownMenuActive
                : {}),
            }}
          >
            <div
              onClick={() => {
                setNoteSorting("alphabetical");
                setShowSortDropdown(false);
              }}
              style={commonStyles.notes.dropdownMenuItem(theme)}
            >
              Alphabetical
            </div>
            <div
              onClick={() => {
                setNoteSorting("creationDate");
                setShowSortDropdown(false);
              }}
              style={commonStyles.notes.dropdownMenuItem(theme)}
            >
              Creation Date
            </div>
            <div
              onClick={() => {
                setNoteSorting("lastModifiedDate");
                setShowSortDropdown(false);
              }}
              style={commonStyles.notes.dropdownMenuItem(theme)}
            >
              Last Modified Date
            </div>
          </div>
        )}
      </div>

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
        {sortedNotes.map((note) => {
          const HTMLbody = marked.parse(note.body);

          return (
            <div
              key={note._id}
              onMouseEnter={() => setHoveredNoteId(note._id)}
              onMouseLeave={() => setHoveredNoteId(null)}
              onClick={() => navigate(`/notes/${note._id}`)}
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
                    HTMLbody.length > 120
                      ? HTMLbody.substring(0, 120) + "..."
                      : HTMLbody,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotesPage;
