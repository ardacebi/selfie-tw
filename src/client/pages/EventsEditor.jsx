import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import fetchEventData from "../data_fetching/fetchEventData";
import patchEventData from "../data_creation/patchEventData";
import patchDeleteEvent from "../data_deletion/patchDeleteEvent";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { CurrentDateContext } from "../contexts/CurrentDateContext";
import { marked } from "marked";
import { ThemeContext } from "../contexts/ThemeContext";
import { FaExclamationCircle } from "react-icons/fa";
import commonStyles from "../styles/commonStyles";
import AnimatedBackButton from "../components/AnimatedBackButton";
import BlurredWindow from "../components/BlurredWindow";
import PageTransition from "../components/PageTransition";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";

const EventsEditor = () => {
  const { theme } = useContext(ThemeContext);
  const { eventID } = useParams();
  const { currentUser } = useContext(CurrentUserContext);
  const { currentDate } = useContext(CurrentDateContext);

  const [saveButtonHover, setSaveButtonHover] = useState(false);

  const [error, setError] = useState("");
  const [showErrorBanner, setShowErrorBanner] = useState(false);

  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [formattedDate, setFormattedDate] = useState("");
  const [editedDuration, setEditedDuration] = useState(null);
  const [editedLocation, setEditedLocation] = useState("");
  const [editedType, setEditedType] = useState(null);
  const [editedFrequencyType, setEditedFrequencyType] = useState(null);
  const [editedFrequencyWeekDays, setEditedFrequencyWeekDays] = useState([]);
  const [editedRepetition, setEditedRepetition] = useState(0);

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

  const { data: eventData, refetch: refetchEvent } = useQuery(
    ["eventData", eventID],
    () => fetchEventData({ eventID: eventID, userID: currentUser }),
    {
      enabled: !!currentUser && !!eventID,
      onError: (err) => {
        setError(err.message);
        setShowErrorBanner(true);
      },
    },
  );

  useEffect(() => {
    if (eventData) {
      setEditedTitle(eventData.data.title || "");
      setEditedDescription(eventData.data.description || "");
      setEditedDate(eventData.data.date || "");
      setEditedDuration(eventData.data.duration || null);
      setEditedLocation(eventData.data.location || "");
      setEditedType(eventData.data.type || null);
      setEditedFrequencyType(eventData.data.frequencyType || null);
      setEditedFrequencyWeekDays(eventData.data.frequencyWeekDays || []);
      setEditedRepetition(eventData.data.repetition || 0);
    }
  }, [eventData]);

  useEffect(() => {
    if (editedDate) {
      const dateObj = new Date(editedDate);
      const formatted =
        Number(editedDuration) === 0
          ? dateObj.toISOString().slice(0, 10)
          : dateObj.toISOString().slice(0, 16);
      setFormattedDate(formatted);
    }
  }, [editedDate, editedDuration]);

  const formatToDate = (formattedDate) => {
    const date = new Date(formattedDate);
    const fullNumber = (number) => (number < 10 ? "0" + number : number);
    return `${date.getFullYear()}-${fullNumber(date.getMonth() + 1)}-${fullNumber(date.getDate())} ${fullNumber(
      date.getHours(),
    )}:${fullNumber(date.getMinutes())}:${fullNumber(date.getSeconds())}`;
  };

  const patchEvent = useMutation(patchEventData, {
    onMutate: () => setShowErrorBanner(false),
    onSuccess: () => {
      refetchEvent();
    },
    onError: (err) => {
      setError(err.message);
      setShowErrorBanner(true);
    },
  });

  return (
    <PageTransition>
      <div>
        <BlurredWindow
          width={isMobile ? "95%" : "850px"}
          padding={isMobile ? "10px" : "20px"}
        >
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

          {eventData ? (
            <div>
              <div
                style={{
                  margin: "0 auto",
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  padding: "5px",
                  boxSizing: "border-box",
                }}
              >
                <AnimatedBackButton to="/calendar" text="Back to Calendar" />
              </div>

              <form>
                <FormInput
                  name="title"
                  placeholder="Title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  required={true}
                  maxLength="20"
                />
                <FormInput
                  name="description"
                  placeholder="Description"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  maxLength="200"
                  style={{ marginTop: "10px" }}
                />
                <FormInput
                  name="date"
                  type={
                    Number(editedDuration) === 0 ? "date" : "datetime-local"
                  }
                  value={formattedDate || ""}
                  onChange={(e) => setEditedDate(e.target.value)}
                  required={true}
                  style={{ marginTop: "10px" }}
                />
                <FormInput
                  name="duration"
                  type="number"
                  placeholder="Duration (in minutes)"
                  value={editedDuration || ""}
                  onChange={(e) => setEditedDuration(e.target.value)}
                />
                <FormInput
                  name="location"
                  placeholder="Location"
                  value={editedLocation}
                  onChange={(e) => setEditedLocation(e.target.value)}
                  style={{ marginTop: "10px" }}
                />
                <FormInput
                  name="type"
                  placeholder="Type (basic or recurring)"
                  value={editedType || ""}
                  onChange={(e) => setEditedType(e.target.value)}
                  style={{ marginTop: "10px" }}
                />
                <FormInput
                  name="frequencyType"
                  placeholder="Frequency Type (daily, weekly, monthly)"
                  value={editedFrequencyType || ""}
                  onChange={(e) => setEditedFrequencyType(e.target.value)}
                  style={{ marginTop: "10px" }}
                />
                <FormInput
                  name="frequencyWeekDays"
                  placeholder="Frequency Week Days (comma-separated, e.g., Mon,Tue)"
                  value={editedFrequencyWeekDays.join(", ")}
                  onChange={(e) =>
                    setEditedFrequencyWeekDays(
                      e.target.value.split(",").map((day) => day.trim()),
                    )
                  }
                  style={{ marginTop: "10px" }}
                />
                <FormInput
                  name="repetition"
                  type="number"
                  placeholder="Repetition (number of times to repeat)"
                  value={editedRepetition || ""}
                  onChange={(e) => setEditedRepetition(e.target.value)}
                  style={{ marginTop: "10px" }}
                />
                <FormButton
                  type="button"
                  onClick={() => {
                    const startDate = new Date(editedDate);

                    const durationMinutes = Number(editedDuration);

                    const endDate = new Date(
                      startDate.getTime() + durationMinutes * 60000,
                    );

                    if (
                      startDate.toISOString().slice(0, 10) !==
                      endDate.toISOString().slice(0, 10)
                    ) {
                      setError(
                        "The event's duration extends to the next day. Please adjust the duration.",
                      );
                      setShowErrorBanner(true);
                      return;
                    }

                    patchEvent.mutate({
                      eventID: eventID,
                      userID: currentUser,
                      title: editedTitle,
                      description: editedDescription,
                      date: editedDate,
                      duration: editedDuration,
                      location: editedLocation,
                      type: editedType,
                      frequencyType: editedFrequencyType,
                      frequencyWeekDays: editedFrequencyWeekDays,
                      repetition: editedRepetition,
                    });
                  }}
                >
                  Save
                </FormButton>
              </form>
            </div>
          ) : (
            <p>Loading event...</p>
          )}
        </BlurredWindow>
      </div>
    </PageTransition>
  );
};

export default EventsEditor;
