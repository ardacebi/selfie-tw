import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { marked } from "marked";
import { ThemeContext } from "../contexts/ThemeContext";
import commonStyles from "../styles/commonStyles.js";

export const HomepageDisplayNote = ({ noteData, isMobile, compact = false }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const { theme } = useContext(ThemeContext);
  const HTMLbody = marked.parse(noteData.body);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        navigate(`/notes`);
      }}
      style={{
        ...commonStyles.notes.noteItem(theme),
        margin: "0 auto",
        width: isMobile ? "100%" : "500px",
        textAlign: "left",
        ...(compact ? { 
          minHeight: "70px",
          padding: isMobile ? "12px" : "15px"
        } : {}),
        ...(hovered ? commonStyles.notes.noteItemHover : {}),
      }}
    >
      <div
        style={{
          ...commonStyles.notes.noteContent,
        }}
      >
        <div>
          <h2 style={compact ? { 
            fontSize: isMobile ? "15px" : "17px", 
            marginBottom: "6px" 
          } : {}}>
            {noteData.title}
          </h2>
          {!compact && (
            <p style={commonStyles.notes.notesDate(theme)}>
              Created on: {new Date(noteData.creationDate).toLocaleDateString()} |
              Last modified:{" "}
              {new Date(noteData.lastModifiedDate).toLocaleDateString()}
            </p>
          )}
          <div
            style={{ 
              wordBreak: "break-word",
              ...(compact ? { 
                fontSize: isMobile ? "13px" : "14px",
                lineHeight: "1.4",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                maxHeight: "2.8em"
              } : {})
            }}
            dangerouslySetInnerHTML={{
              __html: compact 
                ? (HTMLbody.length > 80 ? HTMLbody.substring(0, 80) + "..." : HTMLbody)
                : (HTMLbody.length > 200 ? HTMLbody.substring(0, 200) + "..." : HTMLbody),
            }}
          />
        </div>
      </div>
    </div>
  );
};
