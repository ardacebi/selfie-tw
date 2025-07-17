import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import BlurredWindow from "./BlurredWindow";
import { FaArrowRight } from "react-icons/fa6";
import { useContext } from "react";
import { CurrentDateContext } from "../contexts/CurrentDateContext";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { HomepageDisplayEvent } from "./Events";
import { HomepageDisplayActivity } from "./Activities";
import fetchAllActivitiesData from "../data_fetching/fetchAllActivitiesData";
import fetchAllEventsData from "../data_fetching/fetchAllEventsData";
import fetchAllNotesData from "../data_fetching/fetchAllNotesData";

const RecentStuffCard = ({ isMobile }) => {
  const { currentDate } = useContext(CurrentDateContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { theme } = useContext(ThemeContext);

  const { data: eventsData, refetch: refetchEvents } = useQuery(
    ["userEvents", currentUser],
    () => fetchAllEventsData({ userID: currentUser }),
    { enabled: !!currentUser, refetchOnMount: true, staleTime: 0 },
  );

  const { data: activitiesData, refetch: refetchActivities } = useQuery(
    ["userActivities", currentUser],
    () => fetchAllActivitiesData({ userID: currentUser }),
    { enabled: !!currentUser, refetchOnMount: true, staleTime: 0 },
  );

  const { data: notesData, refetch: refetchNotes } = useQuery(
    ["userNotes", currentUser],
    () => fetchAllNotesData({ userID: currentUser }),
    { enabled: !!currentUser, refetchOnMount: true, staleTime: 0 },
  );

  useEffect(() => {
    refetchEvents();
    refetchActivities();
    refetchNotes();
  }, [refetchEvents, refetchActivities, refetchNotes]);

  const [allEvents, setAllEvents] = useState([]);
  const [allActivities, setAllActivities] = useState([]);
  const [allNotes, setAllNotes] = useState([]);

  useEffect(() => {
    if (eventsData) setAllEvents(eventsData.data);
    if (activitiesData) setAllActivities(activitiesData.data);
    if (notesData) setAllNotes(notesData.data);
  }, [eventsData, activitiesData, notesData]);

  const [nextEvent, setNextEvent] = useState(null);
  const [pendingActivity, setPendingActivity] = useState(null);
  const [lastEditedNote, setLastEditedNote] = useState(null);

  useEffect(() => {
    if (allEvents.length > 0) {
      const upcoming = allEvents.filter(
        (event) => new Date(event.date) >= currentDate,
      );
      if (upcoming.length > 0) {
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        setNextEvent(upcoming[0]);
      }
    }

    if (allActivities.length > 0) {
      const pending = allActivities.filter((activity) => !activity.isCompleted);
      if (pending.length > 0) {
        pending.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        setPendingActivity(pending[0]);
      }
    }

    if (allNotes.length > 0) {
      const notes = [...allNotes];
      notes.sort(
        (a, b) => new Date(b.lastModifiedDate) - new Date(a.lastModifiedDate),
      );
      setLastEditedNote(notes[0]);
    }
  }, [allEvents, allActivities, allNotes, currentDate]);

  const items = useMemo(() => {
    const newItems = [];
    if (nextEvent) {
      newItems.push({
        type: "event",
        item: nextEvent,
        label: "Next Event",
      });
    }
    if (pendingActivity) {
      newItems.push({
        type: "activity",
        item: pendingActivity,
        label: "Pending Activity",
      });
    }
    if (lastEditedNote) {
      newItems.push({
        type: "note",
        item: lastEditedNote,
        label: "Last Edited Note",
      });
    }
    return newItems;
  }, [nextEvent, pendingActivity, lastEditedNote]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userIsControlling, setUserIsControlling] = useState(false);

  useEffect(() => {
    if (items.length > 0 && !userIsControlling) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [items, userIsControlling]);

  // If the items array length changes and the current index is out of bounds, reset it.
  useEffect(() => {
    if (currentIndex >= items.length) setCurrentIndex(0);
  }, [items, currentIndex]);

  return (
    <BlurredWindow>
      {items[currentIndex] ? (
        <div>
          <div>
            <h3 style={{ marginBottom: "10px" }}>
              {items[currentIndex].label}
            </h3>
            <div>
              {items[currentIndex].label === "Next Event" && (
                <HomepageDisplayEvent eventData={items[currentIndex].item} />
              )}
              {items[currentIndex].label === "Pending Activity" && (
                <HomepageDisplayActivity
                  activityData={items[currentIndex].item}
                  isMobile={isMobile}
                />
              )}
              {items[currentIndex].label === "Last Edited Note" && (
                <p>
                  Edited:{" "}
                  {new Date(
                    items[currentIndex].item.lastModifiedDate,
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              if (!userIsControlling) setUserIsControlling(true);
              setCurrentIndex((currentIndex + 1) % items.length);
            }}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "5px",
              backgroundColor: theme === "dark" ? "#444" : "#ddd",
              border: "none",
            }}
          >
            <FaArrowRight />
          </button>
        </div>
      ) : (
        <div>No data.</div>
      )}
    </BlurredWindow>
  );
};

export default RecentStuffCard;
