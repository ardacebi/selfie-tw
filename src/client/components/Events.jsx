import { useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const postNewEventMutation = useMutation(postNewEvent, {
    onMutate: () => setShowErrorBanner(false),
    onSuccess: (res) => {
      setError("");
      setShowErrorBanner(false);
      setShowForm(false);
      refetchAllEventsData();
      const newEventId = res.data._id;
      navigate(`/calendar/${newEventId}`);
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

const eventsFilterer = (allEvents, date, remapDay) => {
  return allEvents.filter((e) => {
    const eventStart = new Date(e.date);

    if (eventStart.toDateString() === date.toDateString()) {
      return true;
    }

    if (e.type === "basic") {
      return eventStart.toDateString() === date.toDateString();
    } else {
      if (date < eventStart) return false;

      const millisecondsInADay = 86400000;

      // Get the difference in days between the event start date and the current date
      const diffDays = Math.floor((date - eventStart) / millisecondsInADay);

      // Get the difference in years between the event start date and the current date
      const yearDiff = date.getFullYear() - eventStart.getFullYear();

      switch (e.frequencyType) {
        case "daily": {
          return (
            diffDays >= 0 && (diffDays < e.repetition || e.repetition === 0)
          );
        }

        case "weekly": {
          const diffWeeks = Math.floor(diffDays / 7);

          return (
            diffWeeks >= 0 &&
            (diffWeeks < e.repetition || e.repetition === 0) &&
            e.frequencyWeekDays.includes(remapDay(date.getDay()))
          );
        }
        case "monthly": {
          const monthDiff =
            yearDiff * 12 + (date.getMonth() - eventStart.getMonth());
          return (
            monthDiff >= 0 &&
            (monthDiff < e.repetition || e.repetition === 0) &&
            eventStart.getDate() === date.getDate()
          );
        }

        case "yearly": {
          return (
            yearDiff >= 0 &&
            (yearDiff < e.repetition || e.repetition === 0) &&
            eventStart.getMonth() === date.getMonth() &&
            eventStart.getDate() === date.getDate()
          );
        }

        default:
          return false;
      }
    }
  });
};

export const DisplayEvents = ({
  allEvents = [],
  date,
  isMobile,
  remapDay,
  error,
  setError,
}) => {
  const { theme } = useContext(ThemeContext);
  const { currentDate } = useContext(CurrentDateContext);
  const { currentUser } = useContext(CurrentUserContext);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const navigate = useNavigate();

  const todayEvents = eventsFilterer(allEvents, date || currentDate, remapDay);

  return (
    <div style={commonStyles.calendar.events.eventsContainer(theme, isMobile)}>
      {todayEvents &&
        todayEvents.map((event) => {
          return (
            <div
              key={event._id}
              onMouseEnter={() => setHoveredEvent(event._id)}
              onMouseLeave={() => setHoveredEvent(null)}
              onClick={() => navigate(`/calendar/${event._id}`)}
              style={commonStyles.calendar.events.eventBox(
                event.type,
                hoveredEvent === event._id,
              )}
            >
              <div style={{ margin: "5px" }}>
                {isMobile && event.title.length > 9
                  ? `${event.title.slice(0, 9)}...`
                  : event.title}
              </div>
              <div style={{ fontSize: isMobile ? "9px" : "10px" }}>
                {event.description && isMobile && event.description?.length > 40
                  ? `${event.description.slice(0, 40)}...`
                  : event.description}
              </div>
            </div>
          );
        })}
    </div>
  );
};
