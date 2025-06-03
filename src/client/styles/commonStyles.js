const commonStyles = {
  // Form fields
  field: {
    border: "2px solid #dcdcdc",
    borderRadius: "10px",
    width: "250px",
    padding: "10px 25px",
    fontSize: "16px",
    transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
  },

  // Buttons
  button: {
    border: "2px solid #dcdcdc",
    borderRadius: "10px",
    width: "100%",
    minWidth: "120px",
    maxWidth: "300px",
    cursor: "pointer",
    padding: "10px 25px",
    fontSize: "16px",
    transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
    textDecoration: "none",
  },

  // Links
  link: {
    textDecoration: "none",
  },

  // Account links
  accountLink: {
    textDecoration: "none",
    display: "block",
    padding: "15px 0px",
  },

  // Error texts
  errorText: {
    color: "gray",
    fontSize: "18px",
    visibility: "hidden",
    textAlign: "center",
  },

  // Logos
  logo: {
    width: "150px",
    height: "150px",
    objectFit: "cover",
    marginBottom: "0px",
    borderRadius: "50%",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    perspective: 1000,
    WebkitPerspective: 1000,
    WebkitTransform: "translateZ(0) scale(1.0, 1.0)",
  },

  // Header containers
  headerContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "10px",
    width: "100%",
    marginTop: "10px",
    marginBottom: "20px",
  },

  // Back buttons
  backButton: {
    border: "2px solid #dcdcdc",
    borderRadius: "10px",
    padding: "8px 15px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
  },

  // Page titles
  pageTitle: {
    textAlign: "center",
    marginBottom: "20px",
  },

  // Gradient title style
  gradientTitle: (theme) => ({
    fontSize: "28px",
    fontWeight: "bold",
    padding: "10px",
    marginBottom: "15px",
    background:
      theme === "dark"
        ? "linear-gradient(to bottom, #ffffff, #dddddd, #aaaaaa, #888888)"
        : "linear-gradient(to bottom, #000000, #222222, #555555, #777777)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textFillColor: "transparent",
    display: "inline-block",
    color: theme === "dark" ? "#ffffff" : "#000000",
    textAlign: "center",
  }),

  // Welcome gradient style for larger titles
  welcomeGradient: (theme) => ({
    fontSize: "34px",
    fontWeight: "bold",
    padding: "10px",
    marginBottom: "10px",
    background:
      theme === "dark"
        ? "linear-gradient(to bottom, #ffffff, #dddddd, #aaaaaa, #888888)"
        : "linear-gradient(to bottom, #000000, #222222, #555555, #777777)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textFillColor: "transparent",
    display: "inline-block",
    color: theme === "dark" ? "#ffffff" : "#000000",
  }),

  // Base banner style
  baseBannerStyle: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: "12px 20px",
    borderRadius: "10px",
    marginTop: "15px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
    fontSize: "16px",
    fontFamily: "sans-serif",
    width: "250px",
    maxWidth: "250px",
    margin: "15px auto 8px auto",
  },

  // Success banner style
  successBannerStyle: (theme, display = "none") => ({
    display,
    backgroundColor: "#4CAF50",
    color: "white",
    border: `2px solid ${theme === "dark" ? "#388E3C" : "#2E7D32"}`,
  }),

  // Error banner style
  errorBannerStyle: (theme, display = "none") => ({
    display,
    backgroundColor: "#F44336",
    color: "white",
    border: `2px solid ${theme === "dark" ? "#D32F2F" : "#C62828"}`,
  }),

  // Icon style for banners
  bannerIconStyle: {
    fontSize: "20px",
    marginRight: "12px",
    flexShrink: 0,
  },

  // Calendar styles
  calendar: {
    // Commonly used calendar colors across light and dark themes
    colors: {
      dark: {
        boxBg: "#2e2e2e",
        selectedBg: "#2a4d69",
        todayBg: "#1e3d58",
        otherMonthBg: "#202020",
        emptyBg: "#2c2c2c",
        borderColor: "#444444",
        textColor: "#e0e0e0",
      },
      light: {
        boxBg: "#ffffff",
        selectedBg: "#cce5ff",
        todayBg: "#e6f7ff",
        otherMonthBg: "#f9f9f9",
        emptyBg: "#e0f0f0",
        borderColor: "#cccccc",
        textColor: "#000000",
      },
    },

    // Calendar box base styles
    box: {
      base: {
        minHeight: "60px",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        transition: "background-color 0.3s, transform 0.2s, border-color 0.3s",
      },
      selected: {
        border: "2px solid #003366",
        transform: "scale(1.1)",
      },
      today: {
        border: "2px solid #0066cc",
        transform: "scale(1.05)",
      },
      otherMonth: {
        border: "1px solid #dddddd",
      },
      week: {
        minHeight: "80px",
      },
    },

    // Calendar container styles
    container: {
      year: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
        gap: "10px",
        padding: "10px",
        borderRadius: "10px",
      },
      month: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gridTemplateRows: "repeat(7, auto)",
        gap: "5px",
        padding: "10px",
        borderRadius: "10px",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
      },
      week: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gridTemplateRows: "repeat(2, auto)",
        gap: "5px",
        padding: "10px",
        borderRadius: "10px",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
      },
      outer: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        maxWidth: "100%",
        overflow: "auto",
      },
    },

    // Calendar button styles
    button: (theme, isHovered = false, isDisabled = false) => ({
      border: `2px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#dcdcdc"}`,
      borderRadius: "10px",
      padding: "8px 15px",
      fontSize: "14px",
      cursor: isDisabled ? "not-allowed" : "pointer",
      margin: "5px",
      backgroundColor: isDisabled
        ? theme === "dark"
          ? "rgba(20, 20, 20, 0.7)"
          : "#e0e0e0"
        : theme === "dark"
          ? "rgba(20, 20, 30, 0.7)"
          : "#fff",
      color: theme === "dark" ? "#e0e0e0" : "#000",
      opacity: isDisabled ? 0.5 : 1,
      backdropFilter: theme === "dark" ? "blur(10px)" : "none",
      WebkitBackdropFilter: theme === "dark" ? "blur(10px)" : "none",
      transition:
        "background-color 0.3s, color 0.3s, border-color 0.3s, transform 0.2s ease, box-shadow 0.2s ease",
      ...(isHovered && !isDisabled
        ? {
            transform: "scale(1.05)",
            boxShadow:
              theme === "dark"
                ? "0 4px 15px rgba(255, 255, 255, 0.1)"
                : "0 4px 15px rgba(0, 0, 0, 0.1)",
          }
        : {}),
    }),

    // Calendar header styles
    header: {
      container: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        width: "100%",
        marginTop: "10px",
      },
      title: {
        textAlign: "center",
        width: "100%",
      },
      monthName: {
        textAlign: "center",
        fontSize: "20px",
        marginBottom: "20px",
        fontWeight: "bold",
      },
      weekDay: {
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontWeight: "bold",
        color: "#333333",
        padding: "5px",
        fontSize: "14px",
      },
    },

    // Calendar button container
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      width: "100%",
      margin: "10px 0",
    },
  },

  // Notes styles
  notes: {
    // NotesPage flex container
    notesPage: (isMobile) => ({
      width: "90%",
      padding: "20px",
      margin: "0 auto",
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      justifyContent: isMobile ? "center" : "flex-start",
      backgroundColor: "transparent",
    }),

    titleWrapper: {
      textAlign: "center",
      width: "100%",
    },

    // Individual note card
    noteItem: (theme) => ({
      backgroundColor: theme === "dark" ? "#2e2e2e" : "#ffffff",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "10px",
      border: `2px solid ${theme === "dark" ? "rgb(63, 63, 63)" : "rgb(213, 213, 213)"}`,
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      width: "100%",
      maxWidth: "250px",
      maxHeight: "400px",
      flex: "1 1 250px",
    }),

    noteItemHover: {
      transform: "translateY(-4px)",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.7)",
      cursor: "pointer",
    },

    notesDate: (theme) => ({
      fontSize: "12px",
      marginTop: "-12px",
      color: theme === "dark" ? "rgb(186, 186, 186)" : "rgb(52, 52, 52)",
    }),

    newNoteFormOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },

    newNoteFormContainer: (theme) => ({
      background: theme === "dark" ? "#2e2e2e" : "#ffffff",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.26)",
      minWidth: "200px",
      fontFamily: "sans-serif",
      textAlign: "center",
    }),

    newNoteButton: (theme, isMobile) => ({
      border: "2px solid",
      borderRadius: "10px",
      padding: "10px 20px",
      fontSize: "16px",
      fontFamily: "sans-serif",
      cursor: "pointer",
      display: "block",
      margin: isMobile ? "10px auto" : "10px auto 10px 5%",
      transition:
        "background-color 0.3s, color 0.3s, border-color 0.3s, transform 0.3s, box-shadow 0.3s",
      backgroundColor: theme === "dark" ? "rgb(5, 5, 5)" : "rgb(255, 255, 255)",
      color: theme === "dark" ? "#e0e0e0" : "#000",
      borderColor: theme === "dark" ? "rgb(63, 63, 63)" : "rgb(213, 213, 213)",
      minWidth: "120px",
      height: isMobile ? "60px" : "auto",
      width: isMobile ? "50%" : "auto",
    }),

    noteButtonHover: (theme) => ({
      backgroundColor: theme === "dark" ? "rgb(238, 238, 238)" : "rgb(5, 5, 5)",
      borderColor: theme === "dark" ? "rgb(213, 213, 213)" : "rgb(63, 63, 63)",
      color: theme === "dark" ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)",
      transform: "translateY(-4px)",
      boxShadow:
        theme === "dark"
          ? "0 4px 8px rgba(255, 255, 255, 0.7)"
          : "0 4px 8px rgba(0, 0, 0, 0.7)",
    }),

    createNoteButton: (theme) => ({
      border: "2px solid",
      borderRadius: "10px",
      padding: "10px 20px",
      fontSize: "16px",
      fontFamily: "sans-serif",
      cursor: "pointer",
      margin: "10px auto",
      transition:
        "background-color 0.3s, color 0.3s, border-color 0.3s, transform 0.3s, box-shadow 0.3s",
      backgroundColor: theme === "dark" ? "rgb(5, 5, 5)" : "rgb(255, 255, 255)",
      color: theme === "dark" ? "#e0e0e0" : "#000",
      borderColor: theme === "dark" ? "rgb(63, 63, 63)" : "rgb(213, 213, 213)",
      minWidth: "120px",
    }),

    cancelNoteButton: (theme) => ({
      border: "2px solid",
      borderRadius: "10px",
      padding: "10px 20px",
      fontSize: "16px",
      fontFamily: "sans-serif",
      cursor: "pointer",
      margin: "10px auto auto 10px",
      transition:
        "background-color 0.3s, color 0.3s, border-color 0.3s, transform 0.3s, box-shadow 0.3s",
      backgroundColor: theme === "dark" ? "rgb(5, 5, 5)" : "rgb(255, 255, 255)",
      color: theme === "dark" ? "#e0e0e0" : "#000",
      borderColor: theme === "dark" ? "rgb(63, 63, 63)" : "rgb(213, 213, 213)",
      minWidth: "120px",
    }),
  },

  // Blurred window/backdrop styles
  blurredBackdrop: (theme) => ({
    backgroundColor:
      theme === "dark" ? "rgba(20, 20, 30, 0.7)" : "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "16px",
    border:
      theme === "dark"
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.05)",
    boxShadow:
      theme === "dark"
        ? "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
        : "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05) inset",
  }),

  // Form-related styles
  form: {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    },
    titleContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "20px",
    },
    inputContainer: {
      width: "90%",
      maxWidth: "400px",
    },
    checkbox: {
      container: {
        display: "flex",
        alignItems: "center",
        marginTop: "5px",
        marginBottom: "5px",
        justifyContent: "flex-start",
        width: "100%",
        boxSizing: "border-box",
        paddingLeft: "5px",
        marginBottom: "15px",
      },
      label: {
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        fontSize: "14px",
        userSelect: "none",
      },
      outer: (theme, isChecked, isHovered) => ({
        width: "20px",
        height: "20px",
        borderRadius: "6px",
        marginRight: "10px",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        border: `2px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"}`,
        backgroundColor: isChecked
          ? theme === "dark"
            ? "#2a4d69"
            : "#cce5ff"
          : "transparent",
        boxShadow: isHovered
          ? theme === "dark"
            ? "0 0 8px rgba(255, 255, 255, 0.2)"
            : "0 0 8px rgba(0, 0, 0, 0.1)"
          : "none",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        cursor: "pointer",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
      }),
      inner: (isChecked) => ({
        opacity: isChecked ? 1 : 0,
        transform: isChecked ? "scale(1)" : "scale(0.6)",
        transition: "all 0.2s ease",
        borderRadius: "4px",
        width: "10px",
        height: "10px",
      }),
      highlight: (theme, isHovered) => ({
        position: "absolute",
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        background:
          theme === "dark"
            ? "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%)"
            : "radial-gradient(ellipse at center, rgba(0, 120, 255, 0.2) 0%, rgba(0, 120, 255, 0) 70%)",
        opacity: isHovered ? 1 : 0,
        transition: "opacity 0.3s ease",
        pointerEvents: "none",
      }),
    },
  },

  // Link hover effect styles
  linkHoverStyles: (theme) => `
    .link-hover-effect:hover {
      background-color: ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
      transform: translateY(-1px);
    }
  `,

  // Info box styles
  infoBox: (theme) => ({
    marginTop: "20px",
    padding: "12px",
    backgroundColor: theme === "dark" ? "rgba(20, 20, 30, 0.7)" : "#f8f8f8",
    border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#ddd"}`,
    borderRadius: "6px",
    display: "flex",
    alignItems: "flex-start",
    width: "90%",
    maxWidth: "400px",
    boxSizing: "border-box",
    backdropFilter: theme === "dark" ? "blur(10px)" : "none",
    WebkitBackdropFilter: theme === "dark" ? "blur(10px)" : "none",
    boxShadow:
      theme === "dark"
        ? "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
        : "none",
  }),

  infoIcon: (theme) => ({
    marginRight: "10px",
    backgroundColor: theme === "dark" ? "#666" : "#e0e0e0",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    color: theme === "dark" ? "#fff" : "#444",
    minWidth: "24px",
    flexShrink: 0,
  }),

  infoText: (theme) => ({
    margin: 0,
    fontSize: "12px",
    color: theme === "dark" ? "#ccc" : "#666",
  }),

  // App button container style (for BaseHomePage app icons)
  appButtonContainer: (theme, isHovered) => ({
    width: "100%",
    height: "100%",
    margin: "0 auto",
    position: "relative",
    backgroundColor:
      theme === "dark" ? "rgba(20, 20, 30, 0.7)" : "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow:
      theme === "dark"
        ? "0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1) inset"
        : "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05) inset",
    border:
      theme === "dark"
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.05)",
    transform: isHovered ? "scale(1.08)" : "scale(1)",
    transition: "transform 0.2s ease",
    zIndex: isHovered ? 10 : 1,
  }),

  getThemeStyles: (theme) => {
    const isDark = theme === "dark";
    return {
      inputBg: isDark ? "#333" : "#fff",
      inputColor: isDark ? "#e0e0e0" : "#000",
      linkColor: isDark ? "#b0b0b0" : "#9A9A9A",
      titleColor: isDark ? "#e0e0e0" : "black",
      borderColor: isDark ? "#444444" : "#dcdcdc",
      hoverBg: isDark ? "#444444" : "#f0f0f0",
      activeBg: isDark ? "#444" : "#e7e7e7",
      boxShadow: isDark
        ? "0 4px 15px rgba(255, 255, 255, 0.1)"
        : "0 4px 15px rgba(0, 0, 0, 0.1)",
      focusShadow: isDark ? "0 0 0 2px #555555" : "0 0 0 2px #e0e0e0",
      pageBg: isDark ? "#1e1e1e" : "#f8f8f8",
      pageText: isDark ? "#e0e0e0" : "black",
    };
  },

  getDynamicCSS: (theme) => {
    const isDark = theme === "dark";
    return `
      button:hover, a:hover {
        background-color: ${isDark ? "#444444" : "#f0f0f0"} !important;
      }
      
      input:focus {
        outline: none !important;
        box-shadow: 0 0 0 2px ${isDark ? "#555555" : "#e0e0e0"} !important;
        border-color: ${isDark ? "#666666" : "#cccccc"} !important;
      }
    `;
  },

  // Responsive styles
  getResponsiveStyles: (windowWidth) => {
    // Mobile styles
    if (windowWidth < 576) {
      return {
        calendar: {
          box: {
            minHeight: "35px",
            fontSize: "12px",
            padding: "2px",
          },
          weekDay: {
            fontSize: "9px",
            padding: "2px",
          },
          button: {
            padding: "4px 6px",
            fontSize: "11px",
            marginBottom: "5px",
          },
          container: {
            gap: "1px",
            padding: "4px",
          },
          yearGrid: {
            gridTemplateColumns: "repeat(3, 1fr)",
            fontSize: "12px",
          },
          monthName: {
            fontSize: "14px",
            marginBottom: "10px",
          },
          headerButton: {
            fontSize: "11px",
            padding: "4px 8px",
            width: "100%",
            maxWidth: "120px",
            margin: "5px auto",
            display: "block",
          },
        },
      };
    }
    // Tablet styles
    else if (windowWidth < 768) {
      return {
        calendar: {
          box: {
            minHeight: "40px",
            fontSize: "13px",
            padding: "3px",
          },
          weekDay: {
            fontSize: "10px",
            padding: "3px",
          },
          button: {
            padding: "5px 8px",
            fontSize: "12px",
          },
          container: {
            gap: "2px",
          },
          yearGrid: {
            gridTemplateColumns: "repeat(4, 1fr)",
          },
          monthName: {
            fontSize: "16px",
          },
        },
      };
    }
    // Default/desktop styles
    return {};
  },

  // Theme transition styles
  themeTransition: {
    cssVars: `
      :root {
        --_duration: var(--tds-animate-transition-duration--medium, 600ms);
        --_easing: var(--web__transition-easing, cubic-bezier(0.4, 0, 0.2, 1));
        --tds-size--1x: 12px;
      }
    `,

    baseStyles: (theme) => `
      body, html {
        margin: 0;
        padding: 0;
        height: 100%;
        color: ${theme === "dark" ? "#e0e0e0" : "black"};
        transition: color var(--_duration) var(--_easing);
        overscroll-behavior: none;
        -webkit-text-size-adjust: 100%;
        -moz-text-size-adjust: 100%;
        text-size-adjust: 100%;
        background-color: transparent;
      }
      
      .page-background {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${theme === "dark" ? "#000000" : "#f8f7f5"};
        z-index: -1;
        transition: filter var(--_duration) var(--_easing),
                    transform var(--_duration) var(--_easing),
                    background-color 0ms; /* Instant color change */
      }
      
      .page-background.transitioning {
        filter: blur(var(--tds-size--1x));
        transform: scale(1.05);
      }
      
      /* Prevent mobile zoom on input focus */
      input, select, textarea {
        font-size: 16px !important; /* Prevents iOS zoom */
      }

      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }

      .no-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
      }

      a, button, input, select, textarea {
        touch-action: manipulation;
      }
      
      /* Global link hover effect */
      .link-hover-effect:hover {
        background-color: ${theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
        transform: translateY(-1px);
        border-radius: 6px;
      }
      
      /* Star background transition */
      .star-background-container {
        transition: filter var(--_duration) var(--_easing),
                    transform var(--_duration) var(--_easing);
      }
      
      .star-background-container.transitioning {
        filter: blur(var(--tds-size--1x));
        transform: scale(1.05);
      }
    `,

    getGlobalStyles: (theme) => {
      return (
        commonStyles.themeTransition.cssVars +
        commonStyles.themeTransition.baseStyles(theme)
      );
    },
  },

  // App shell styles
  appShell: {
    page: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "sans-serif",
      transition: "background-color 0.3s, color 0.3s",
      position: "relative",
    },
    mainContent: {
      display: "flex",
      justifyContent: "center",
      flexGrow: 1,
    },
  },

  // Banner styles
  getBannerStyle: (type, visible, theme) => ({
    ...commonStyles.baseBannerStyle,
    ...(type === "errorBannerStyle"
      ? commonStyles.errorBannerStyle(theme, visible ? "flex" : "none")
      : commonStyles.successBannerStyle(theme, visible ? "flex" : "none")),
    width: "90%",
    maxWidth: "400px",
    boxSizing: "border-box",
    margin: "20px auto 0",
  }),

  // Page specific styles
  pages: {
    // Not Found Page styles
    notFound: {
      title: (theme) => ({
        ...commonStyles.welcomeGradient(theme),
        fontSize: "64px",
        fontWeight: "bold",
        marginBottom: "5px",
      }),

      subtitle: (theme) => ({
        fontSize: "24px",
        fontWeight: "normal",
        marginTop: "10px",
        marginBottom: "30px",
        color: theme === "dark" ? "#e0e0e0" : "#333333",
        textAlign: "center",
        fontFamily: "sans-serif",
      }),

      image: {
        maxWidth: "125px",
        margin: "15px 0",
      },

      homeButton: (theme) => ({
        ...commonStyles.button,
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#e0e0e0" : "#000",
        borderColor: theme === "dark" ? "#444444" : "#dcdcdc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textDecoration: "none",
        width: "180px",
        marginTop: "10px",
      }),
    },

    // Common page elements
    common: {
      imageContainer: {
        textAlign: "center",
        marginBottom: "20px",
      },

      centerAlignedContent: {
        textAlign: "center",
        width: "100%",
        marginTop: "20px",
      },

      navLink: (theme) => ({
        ...commonStyles.link,
        color: commonStyles.getThemeStyles(theme).linkColor,
        display: "inline-block",
        padding: "6px 12px",
        borderRadius: "6px",
        transition: "background-color 0.2s ease, transform 0.2s ease",
      }),
    },
  },
};

export default commonStyles;
