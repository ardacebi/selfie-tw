import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { CurrentDateContext } from "../contexts/CurrentDateContext";

const CalendarPage = () => {
  //These are setup variables for the calendar used through the entire page
  const { currentDate } = useContext(CurrentDateContext);
  const [calendarDate, setCalendarDate] = useState(currentDate);
  const [selectZoomLevel, setSelectZoomLevel] = useState(1);

  //Takes the year and the month and returns the amount of days of that month in that year
  const findMonthsDays = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  //Takes the year and the moth and returns the day of the week of the first day of the month
  const findFirstDay = (year, month) => {
    return new Date(year, month, 0).getDay();
  };

  //This function is called when a day is clicked and it sets the calendarDate to the date of the day clicked
  const handleDateClick = (year, month, day) => {
    setCalendarDate(new Date(year, month, day));
  };

  //This function is used to change the calendarDate to the previous month. If it is possible it keeps the same day, if it
  //is not possible it sets the day to the last day of the month
  const changeToPrevMonth = () => {
    const prevMonthDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth() - 1,
    );
    if (
      findMonthsDays(prevMonthDate.getFullYear(), prevMonthDate.getMonth()) <
      calendarDate.getDate()
    ) {
      setCalendarDate(prevMonthDate);
    } else {
      setCalendarDate(
        new Date(
          prevMonthDate.getFullYear(),
          prevMonthDate.getMonth(),
          calendarDate.getDate(),
        ),
      );
    }
  };

  //This function is used to change the calendarDate to the next month. If it is possible it keeps the same day, if it
  //is not possible it sets the day to the last day of the month
  const changeToNextMonth = () => {
    const nextMonthDate = new Date(
      calendarDate.getFullYear(),
      calendarDate.getMonth() + 1,
    );
    if (
      findMonthsDays(nextMonthDate.getFullYear(), nextMonthDate.getMonth()) <
      calendarDate.getDate()
    ) {
      setCalendarDate(nextMonthDate);
    } else {
      setCalendarDate(
        new Date(
          nextMonthDate.getFullYear(),
          nextMonthDate.getMonth(),
          calendarDate.getDate(),
        ),
      );
    }
  };

  //This function is used to change the calendarDate to the previous year, the day and the month are kept the same
  const changeToPrevYear = () => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear() - 1,
        calendarDate.getMonth(),
        calendarDate.getDate(),
      ),
    );
  };

  //This function is used to change the calendarDate to the next year, the day and the month are kept the same
  const changeToNextYear = () => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear() + 1,
        calendarDate.getMonth(),
        calendarDate.getDate(),
      ),
    );
  };

  //This function is used to change the calendarDate to the previous week
  const changeToPrevWeek = () => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        calendarDate.getDate() - 7,
      ),
    );
  };

  //This function is used to change the calendarDate to the next week
  const changeToNextWeek = () => {
    setCalendarDate(
      new Date(
        calendarDate.getFullYear(),
        calendarDate.getMonth(),
        calendarDate.getDate() + 7,
      ),
    );
  };

  //Decreases the value of the variable selectZoomLevel by 1, if the value is already 0 it does nothing
  const decreaseZoomLevel = () => {
    if (selectZoomLevel > 0) setSelectZoomLevel(selectZoomLevel - 1);
  };

  //Increases the value of the variable selectZoomLevel by 1, if the value is already 2 it does nothing
  const increaseZoomLevel = () => {
    if (selectZoomLevel < 2) setSelectZoomLevel(selectZoomLevel + 1);
  };

  //This function is used to return the month and the year of the calendarDate in italian
  const renderMonth = () => {
    const currentYear = calendarDate.getFullYear();
    const currentMonth = calendarDate.getMonth();
    const months = [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ];
    return `${months[currentMonth]} ${currentYear}`;
  };

  //This function renders the calendar when selectZoomLevel is 1. This level shows an entire month of the year in a grid.
  const renderMonthCalendar = () => {
    const currentYear = calendarDate.getFullYear();
    const currentMonth = calendarDate.getMonth();
    const monthsTotalDays = findMonthsDays(currentYear, currentMonth);
    const firstDay = findFirstDay(currentYear, currentMonth);

    //This array will contain all the divs that will be rendered in the calendar
    let allDays = [];

    allDays.push(<div style={styles.week_day}>Lunedi</div>);
    allDays.push(<div style={styles.week_day}>Martedi</div>);
    allDays.push(<div style={styles.week_day}>Mercoledi</div>);
    allDays.push(<div style={styles.week_day}>Giovedi</div>);
    allDays.push(<div style={styles.week_day}>Venerdi</div>);
    allDays.push(<div style={styles.week_day}>Sabato</div>);
    allDays.push(<div style={styles.week_day}>Domenica</div>);

    for (let i = 0; i < firstDay; i++) {
      allDays.push(
        <div key={`empty-${i}`} style={styles.empty_calendar_box}></div>,
      );
    }

    for (let i = 1; i <= monthsTotalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isSelected =
        calendarDate && calendarDate.toDateString() === date.toDateString();

      const isToday = currentDate.toDateString() === date.toDateString();

      allDays.push(
        <div
          key={`day-${i}`}
          style={
            isSelected
              ? styles.calendar_box_selected
              : isToday
                ? styles.calendar_box_today
                : styles.calendar_box
          }
          onClick={() => {
            handleDateClick(currentYear, currentMonth, i);
          }}
        >
          {i}
        </div>,
      );
    }

    return allDays;
  };

  //Similar to renderMonth, but it does not return the year, only the month
  const monthName = (month) => {
    const months = [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ];
    return months[month];
  };

  //This function renders the calendar when selectZoomLevel is 0. This level shows an entire year ina grid.
  const renderYearCalendar = () => {
    const currentYear = calendarDate.getFullYear();

    //This array will contain all the divs that will be rendered in the calendar
    const allMonths = [];
    for (let i = 0; i < 12; i++) {
      const dateSelected = new Date(currentYear, i, calendarDate.getDate());
      const isSelected =
        calendarDate &&
        calendarDate.toDateString() === dateSelected.toDateString();

      const dateToday = new Date(currentYear, i, currentDate.getDate());
      const isToday = currentDate.toDateString() === dateToday.toDateString();

      allMonths.push(
        <div>
          <div
            style={
              isSelected
                ? styles.calendar_box_selected
                : isToday
                  ? styles.calendar_box_today
                  : styles.calendar_box
            }
            onClick={() => {
              handleDateClick(currentYear, i, 1);
            }}
          >
            {monthName(i)}
          </div>
        </div>,
      );
    }

    return allMonths;
  };

  //The getDay() function of the Date class sets Sunday as 0, this function remaps it to 6 and Monday to 0
  const remapGetDay = (day) => {
    if (day === 0) return 6;
    return day - 1;
  };

  //This function renders the calendar when selectZoomLevel is 2. This level shows a week of the month in a grid.
  const renderWeekCalendar = () => {
    const currentYear = calendarDate.getFullYear();
    const currentMonth = calendarDate.getMonth();
    let weekTotalDays = 7;
    const monthsTotalDays = findMonthsDays(currentYear, currentMonth);
    const firstDay = findFirstDay(currentYear, currentMonth);

    //This array will contain all the divs that will be rendered in the calendar
    let allDays = [];

    allDays.push(<div style={styles.week_day}>Lunedi</div>);
    allDays.push(<div style={styles.week_day}>Martedi</div>);
    allDays.push(<div style={styles.week_day}>Mercoledi</div>);
    allDays.push(<div style={styles.week_day}>Giovedi</div>);
    allDays.push(<div style={styles.week_day}>Venerdi</div>);
    allDays.push(<div style={styles.week_day}>Sabato</div>);
    allDays.push(<div style={styles.week_day}>Domenica</div>);

    let firstWeekDay =
      calendarDate.getDate() - remapGetDay(calendarDate.getDay());

    //If the first day of the week is in the previous month, you should render the last days of the previous month. When selecting
    //a day in the previous month, the calendarDate should be set to the day of the month selected
    if (firstWeekDay < 1) {
      let prevMonthThisWeekDays = 0;
      while (prevMonthThisWeekDays < firstDay) prevMonthThisWeekDays++;
      const prevMonthTotalDays = findMonthsDays(currentYear, currentMonth - 1);

      for (
        let i = prevMonthTotalDays - prevMonthThisWeekDays + 1;
        i <= prevMonthTotalDays;
        i++
      ) {
        const date = new Date(currentYear, currentMonth - 1, i);
        const isSelected =
          calendarDate && calendarDate.toDateString() === date.toDateString();

        const isToday = currentDate.toDateString() === date.toDateString();

        allDays.push(
          <div
            key={`day-${i}`}
            style={
              isSelected
                ? styles.calendar_day_week_box_selected
                : isToday
                  ? styles.calendar_day_week_box_today
                  : styles.calendar_day_week_box_other_month
            }
            onClick={() => {
              handleDateClick(currentYear, currentMonth - 1, i);
            }}
          >
            {i}
          </div>,
        );
        weekTotalDays--;
      }

      for (let i = 1; i <= weekTotalDays; i++) {
        const date = new Date(currentYear, currentMonth, i);
        const isSelected =
          calendarDate && calendarDate.toDateString() === date.toDateString();

        const isToday = currentDate.toDateString() === date.toDateString();

        allDays.push(
          <div
            key={`day-${i}`}
            style={
              isSelected
                ? styles.calendar_day_week_box_selected
                : isToday
                  ? styles.calendar_day_week_box_today
                  : styles.calendar_day_week_box
            }
            onClick={() => {
              handleDateClick(currentYear, currentMonth, i);
            }}
          >
            {i}
          </div>,
        );
      }
    } else {
      let j = 1;

      for (
        let i = firstWeekDay;
        j <= weekTotalDays && i <= monthsTotalDays;
        i++
      ) {
        const date = new Date(currentYear, currentMonth, i);
        const isSelected =
          calendarDate && calendarDate.toDateString() === date.toDateString();

        const isToday = currentDate.toDateString() === date.toDateString();

        allDays.push(
          <div
            key={`day-${i}`}
            style={
              isSelected
                ? styles.calendar_day_week_box_selected
                : isToday
                  ? styles.calendar_day_week_box_today
                  : styles.calendar_day_week_box
            }
            onClick={() => {
              handleDateClick(currentYear, currentMonth, i);
            }}
          >
            {i}
          </div>,
        );
        j++;
      }

      //If the last day of the week is in the next month, you should render the first days of the next month. When selecting
      //a day in the next month, the calendarDate should be set to the day of the month selected
      if (j <= weekTotalDays) {
        for (let i = 1; j <= weekTotalDays; i++, j++) {
          const date = new Date(currentYear, currentMonth + 1, i);
          const isSelected =
            calendarDate && calendarDate.toDateString() === date.toDateString();

          const isToday = currentDate.toDateString() === date.toDateString();

          allDays.push(
            <div
              key={`day-${i}`}
              style={
                isSelected
                  ? styles.calendar_day_week_box_selected
                  : isToday
                    ? styles.calendar_day_week_box_today
                    : styles.calendar_day_week_box_other_month
              }
              onClick={() => {
                handleDateClick(currentYear, currentMonth + 1, i);
              }}
            >
              {i}
            </div>,
          );
        }
      }
    }

    return allDays;
  };

  return (
    <div>
      <h1>Calendar Page</h1>
      <div>
        <button onClick={increaseZoomLevel}>Increase Zoom</button>
        <button onClick={decreaseZoomLevel}>Decrease Zoom</button>
      </div>
      {selectZoomLevel === 0 && (
        <>
          <div style={styles.month_name}>{calendarDate.getFullYear()}</div>
          <button onClick={changeToPrevYear}>Previous Year</button>
          <button onClick={changeToNextYear}>Next Year</button>
          <div style={styles.year_calendar}>{renderYearCalendar()}</div>
        </>
      )}

      {selectZoomLevel === 1 && (
        <>
          <button onClick={changeToPrevMonth}>Previous Month</button>
          <button onClick={changeToNextMonth}>Next Month</button>
          <div style={styles.month_name}>{renderMonth()}</div>
          <div style={styles.month_calendar}>{renderMonthCalendar()}</div>
        </>
      )}

      {selectZoomLevel === 2 && (
        <>
          <button onClick={changeToPrevWeek}>Previous Week</button>
          <button onClick={changeToNextWeek}>Next Week</button>
          <div style={styles.month_name}>{renderMonth()}</div>
          <div style={styles.week_calendar}>{renderWeekCalendar()}</div>
        </>
      )}
    </div>
  );
};

export default CalendarPage;

const styles = {
  month_calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "repeat(7, auto)",
  },
  empty_calendar_box: {
    backgroundColor: "#f8f7f5",
    height: "100px",
    width: "100px",
  },
  calendar_box: {
    backgroundColor: "#f8f7f5",
    border: "2px solid rgb(40, 40, 40)",
    height: "100px",
    width: "100px",
  },
  calendar_box_selected: {
    border: "2px solid rgba(0, 47, 80, 0.77)",
    height: "100px",
    width: "100px",
    backgroundColor: "lightblue",
  },
  calendar_box_today: {
    border: "2px solid rgb(9, 152, 255)",
    height: "100px",
    width: "100px",
    backgroundColor: "rgb(212, 232, 248)",
  },
  week_day: {
    justifyContent: "center",
    alignItems: "center",
    height: "30px",
    width: "100px",
    textAlign: "center",
  },
  month_name: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "20px",
  },
  year_calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gridTemplateRows: "repeat(3, 1fr)",
  },
  week_calendar: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gridTemplateRows: "repeat(2, auto)",
  },
  calendar_day_week_box: {
    backgroundColor: "#f8f7f5",
    border: "2px solid rgb(40, 40, 40)",
    height: "350px",
    width: "100px",
  },
  calendar_day_week_box_other_month: {
    backgroundColor: "#f8f7f5",
    border: "2px solid rgb(167, 167, 167)",
    height: "350px",
    width: "100px",
  },
  calendar_day_week_box_selected: {
    border: "2px solid rgba(0, 47, 80, 0.77)",
    height: "350px",
    width: "100px",
    backgroundColor: "lightblue",
  },
  calendar_day_week_box_today: {
    border: "2px solid rgb(9, 152, 255)",
    height: "350px",
    width: "100px",
    backgroundColor: "rgb(212, 232, 248)",
  },
};
