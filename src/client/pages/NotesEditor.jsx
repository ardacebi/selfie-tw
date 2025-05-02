import { useContext, useState, useEffect, useRef } from "react";
import { CurrentDateContext } from "../contexts/CurrentDateContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { FaArrowLeft, FaArrowRight, FaHome, FaSearch, FaSearchMinus, FaSearchPlus } from "react-icons/fa";
import commonStyles from "../styles/commonStyles";
import postNewNote from "../data_creation/postNewNote";

const NotesEditor = () => {
  const { theme } = useContext(ThemeContext);
  const { currentDate } = useContext(CurrentDateContext);


}