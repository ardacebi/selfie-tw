import { useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import commonStyles from "../styles/commonStyles.js";
import FormInput from "./FormInput";
import { FaExclamationCircle } from "react-icons/fa";
import { ThemeContext } from "../contexts/ThemeContext";
import { CurrentUserContext } from "../contexts/CurrentUserContext.jsx";
import postNewEvent from "../data_creation/postNewEvent.js";
import { CurrentDateContext } from "../contexts/CurrentDateContext";
import FormButton from "./FormButton.jsx";

export const NewEventForm = ({
  showForm,
  setShowForm,
  refetchAllEventsData,
  date,
  setShowErrorBanner,
  showErrorBanner,
  error = "",
  setError,
}) => {
  const { theme } = useContext(ThemeContext);
  const { currentDate } = useContext(CurrentDateContext);
  const { currentUser } = useContext(CurrentUserContext);

  const postNewEventMutation = useMutation(postNewEvent, {
    onMutate: () => setShowErrorBanner(false),
    onSuccess: () => {
      setError("");
      setShowErrorBanner(false);
    },
    onError: (err) => {
      setError(err.message);
      setShowErrorBanner(true);
    },
  });

  const handleNewEventSubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const title = formData.get("title");
      postNewEventMutation.mutate({
        title: title,
        date: date,
        type: "basic",
        userID: currentUser,
      });
      refetchAllEventsData();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
      setShowErrorBanner(true);
    }
  };

  const cancelButtonClickHandler = () => {
    setShowForm(false);
    setShowErrorBanner(false);
    setError("");
  };

  return (
    <div>
      {showForm && (
        <div style={commonStyles.notes.newNoteFormOverlay}>
          <div style={commonStyles.notes.newNoteFormContainer(theme)}>
            <form onSubmit={handleNewEventSubmit}>
              <FormInput
                name="title"
                placeholder="Title"
                required={true}
                maxLength="20"
              />
              <div style={{ marginTop: "10px" }}>
                <FormButton>Create Event</FormButton>
                <FormButton onClick={cancelButtonClickHandler} type="button">
                  Cancel
                </FormButton>
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
    </div>
  );
};

export const DisplayEvents = ({
  allEvents = [],
  date,
  isMobile,
  error,
  setError,
}) => {
  const { theme } = useContext(ThemeContext);
  const { currentDate } = useContext(CurrentDateContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [hoveredEvent, setHoveredEvent] = useState(null);

  const todayEvents = allEvents.filter(
    (e) => new Date(e.date).toDateString() === date.toDateString(),
  );

  return (
    <div style={commonStyles.calendar.events.eventsContainer(theme, isMobile)}>
      {todayEvents &&
        todayEvents.map((event) => {
          return (
            <div
              key={event._id}
              onMouseEnter={() => setHoveredEvent(event._id)}
              onMouseLeave={() => setHoveredEvent(null)}
              style={commonStyles.calendar.events.eventBox(
                event.type,
                hoveredEvent === event._id,
              )}
            >
              <div>
                {isMobile && event.title.length > 9
                  ? `${event.title.slice(0, 9)}...`
                  : event.title}
              </div>
            </div>
          );
        })}
    </div>
  );
};
