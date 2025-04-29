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
    maxWidth: "150px",
    height: "auto",
    marginBottom: "0px",
    borderRadius: "10px",
  },
  
  // Header containers
  headerContainer: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: "10px",
    width: "100%",
    marginTop: "10px",
    marginBottom: "20px"
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
    marginBottom: "20px"
  },
  
  // Gradient title style
  gradientTitle: (theme) => ({
    fontSize: '28px',
    fontWeight: 'bold',
    padding: '10px',
    marginBottom: '15px',
    background: theme === 'dark' 
      ? 'linear-gradient(to bottom, #ffffff, #dddddd, #aaaaaa, #888888)'
      : 'linear-gradient(to bottom, #000000, #222222, #555555, #777777)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    display: 'inline-block',
    color: theme === 'dark' ? '#ffffff' : '#000000',
    textAlign: 'center',
  }),
  
  // Welcome gradient style for larger titles
  welcomeGradient: (theme) => ({
    fontSize: '34px',
    fontWeight: 'bold',
    padding: '10px',
    marginBottom: '10px',
    background: theme === 'dark' 
      ? 'linear-gradient(to bottom, #ffffff, #dddddd, #aaaaaa, #888888)'
      : 'linear-gradient(to bottom, #000000, #222222, #555555, #777777)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    display: 'inline-block',
    color: theme === 'dark' ? '#ffffff' : '#000000',
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
    border: `2px solid ${theme === 'dark' ? '#388E3C' : '#2E7D32'}`,
  }),
  
  // Error banner style
  errorBannerStyle: (theme, display = "none") => ({
    display,
    backgroundColor: "#F44336",
    color: "white",
    border: `2px solid ${theme === 'dark' ? '#D32F2F' : '#C62828'}`,
  }),
  
  // Icon style for banners
  bannerIconStyle: {
    fontSize: '20px',
    marginRight: '12px',
    flexShrink: 0,
  },
  
  getThemeStyles: (theme) => {
    const isDark = theme === 'dark';
    return {
      inputBg: isDark ? '#333' : '#fff',
      inputColor: isDark ? '#e0e0e0' : '#000',
      linkColor: isDark ? '#b0b0b0' : '#9A9A9A',
      titleColor: isDark ? '#e0e0e0' : 'black',
      borderColor: isDark ? '#444444' : '#dcdcdc',
      hoverBg: isDark ? '#444444' : '#f0f0f0',
      activeBg: isDark ? '#444' : '#e7e7e7',
    };
  },
  
  getDynamicCSS: (theme) => {
    const isDark = theme === 'dark';
    return `
      button:hover, a:hover {
        background-color: ${isDark ? '#444444' : '#f0f0f0'} !important;
      }
      
      input:focus {
        outline: none !important;
        box-shadow: 0 0 0 2px ${isDark ? '#555555' : '#e0e0e0'} !important;
        border-color: ${isDark ? '#666666' : '#cccccc'} !important;
      }
    `;
  }
};

export default commonStyles;