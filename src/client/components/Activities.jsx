import { useState, useContext, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import commonStyles from "../styles/commonStyles.js";
import FormInput from "./FormInput.jsx";
import { FaExclamationCircle } from "react-icons/fa";
import { ThemeContext } from "../contexts/ThemeContext.jsx";
import { CurrentUserContext } from "../contexts/CurrentUserContext.jsx";
import postNewActivity from "../data_creation/postNewActivity.js";
import patchActivityData from "../data_creation/patchActivityData.js";
import { CurrentDateContext } from "../contexts/CurrentDateContext.jsx";
import FormButton from "./FormButton.jsx";

export const NewActivityForm = ({
  showForm,
  setShowForm,
  refetchAllActivitiesData,
  endDate,
  setShowErrorBanner,
  showErrorBanner,
  error = "",
  setError,
}) => {
  const { theme } = useContext(ThemeContext);
  const { currentDate } = useContext(CurrentDateContext);
  const { currentUser } = useContext(CurrentUserContext);
  const navigate = useNavigate();

  const [formattedEndDate, setFormattedEndDate] = useState(null);

  useEffect(() => {
    if (endDate) {
      const dateObj = new Date(endDate);
      const timeZoneOffset = dateObj.getTimezoneOffset() * 60000;
      const formatted = new Date(dateObj - timeZoneOffset)
        .toISOString()
        .slice(0, 10);
      setFormattedEndDate(formatted);
    }
  }, [endDate]);

  const formatToDate = (fDate) => {
    if (!fDate) return null;
    else return new Date(fDate + "T00:00:00");
  };

  const postNewActivityMutation = useMutation(postNewActivity, {
    onMutate: () => setShowErrorBanner(false),
    onSuccess: (res) => {
      setError("");
      setShowErrorBanner(false);
      setShowForm(false);
      refetchAllActivitiesData();
      const newActivityId = res.data._id;
      //navigate(`/calendar/${newActivityId}`);
    },
    onError: (err) => {
      setError(err.message);
      setShowErrorBanner(true);
    },
  });

  const handleNewActivitySubmit = async (e) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.target);
      const title = formData.get("title");
      const description = formData.get("description");
      const formEndDate = formatToDate(formattedEndDate);
      postNewActivityMutation.mutate({
        title: title,
        description: description,
        startDate: currentDate,
        endDate: formEndDate,
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
            <form onSubmit={handleNewActivitySubmit}>
              <FormInput
                name="title"
                placeholder="Title"
                required={true}
                maxLength="20"
              />
              <FormInput
                name="description"
                placeholder="Description"
                required={true}
                maxLength="150"
              />
              <p
                style={{
                  color:
                    theme === "dark" ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)",
                }}
              >
                Activity Ends At:
              </p>
              <FormInput
                name="endDate"
                type="date"
                required={true}
                value={formattedEndDate || ""}
                onChange={(e) => setFormattedEndDate(e.target.value)}
              />
              <div style={{ marginTop: "10px" }}>
                <FormButton>Create Activity</FormButton>
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

export const DisplayActivities = ({
  allActivities = [],
  date,
  isMobile,
  error,
  setError,
}) => {
  const { theme } = useContext(ThemeContext);
  const { currentDate } = useContext(CurrentDateContext);
  const navigate = useNavigate();

  // Activities are “from now until a certain deadline”
  // We show an activity on a day if that day is the deadline.
  // You could expand this logic to show tasks spanning days if needed.
  const activitiesForDate = allActivities.filter((activity) => {
    const deadline = new Date(activity.endDate);
    return deadline.toDateString() === date.toDateString();
  });

  return (
    <div
    //style={commonStyles.calendar.activities.activitiesContainer(theme,isMobile,)}
    >
      {activitiesForDate.map((activity) => {
        const deadline = new Date(activity.endDate);
        // Overdue if not completed and deadline is in the past relative to today's date
        const isOverdue =
          !activity.isCompleted && deadline < new Date(currentDate);
        return (
          <div
            key={activity._id}
            //onClick={() => navigate(`/calendar/${activity._id}`)}
            /*
            style={{
              ...commonStyles.calendar.activities.activityBox(
                activity,
                isOverdue,
              ),
              cursor: "pointer",
            }}
              */
          >
            <div
              style={{ margin: "3px", fontSize: isMobile ? "10px" : "12px" }}
            >
              {activity.title}
            </div>
            {isOverdue && (
              <div
                style={{ color: "red", fontSize: isMobile ? "8px" : "10px" }}
              >
                Overdue
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ActivitiesSummary = ({
  activities = [],
  refetchAllActivitiesData,
  setError,
}) => {
  const { currentDate } = useContext(CurrentDateContext);
  const { currentUser } = useContext(CurrentUserContext);
  const { theme } = useContext(ThemeContext);

  const getDayDiff = (date1, date2) => {
    //one day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    return Math.floor((date2 - date1) / oneDay);
  };

  const filteredActivities = activities
    .filter((activity) => !activity.isCompleted)
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

  const updateActivityMutation = useMutation(patchActivityData, {
    onError: (err) => {
      setError(err.message);
    },
    onSuccess: () => {
      refetchAllActivitiesData();
      setError("");
    },
  });

  const handleCheckboxChange = (
    actTitle,
    actStartDate,
    actEndDate,
    activityID,
    isChecked,
  ) => {
    updateActivityMutation.mutate({
      title: actTitle,
      startDate: actStartDate,
      endDate: actEndDate,
      activityID: activityID,
      isCompleted: isChecked,
      userID: currentUser,
    });
  };

  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: theme === "dark" ? "#333" : "#eee",
      }}
    >
      {filteredActivities.map((activity) => {
        const startDate = new Date(activity.startDate);
        const endDate = new Date(activity.endDate);
        const current = new Date(currentDate);

        const daysPassed = getDayDiff(startDate, current);
        const daysRemaining = getDayDiff(current, endDate);
        const isOverdue = current > endDate;
        const overdueDays = isOverdue
          ? Math.abs(getDayDiff(endDate, current))
          : 0;

        return (
          <div
            key={activity._id}
            style={{
              border: "1px solid #ccc",
              marginBottom: "8px",
              padding: "8px",
              backgroundColor: theme === "dark" ? "#444" : "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <p>Days Passed: {daysPassed}</p>
              {isOverdue ? (
                <p style={{ color: "red" }}>Overdue by {overdueDays} day(s)</p>
              ) : (
                <p>Days Remaining: {daysRemaining}</p>
              )}
              <input
                type="checkbox"
                checked={activity.isCompleted || false}
                onChange={(e) =>
                  handleCheckboxChange(
                    activity.title,
                    activity.startDate,
                    activity.endDate,
                    activity._id,
                    e.target.checked,
                  )
                }
                style={{ marginRight: "8px" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
