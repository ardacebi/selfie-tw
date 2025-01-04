import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignUpForm";
import ForgotPasswordForm from "./pages/ForgotPasswordForm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <div style={styles.page}>
          <header style={styles.header}>
            <div style={styles.form}>
              <img style={styles.logo} src="/client/assets/logo.png" alt="Selfie Logo"/><br></br>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link style={{ ...styles.button, ...styles.button1 }} to="/login">Login</Link>
                <Link style={styles.button} to="/sign_up">Sign Up</Link>
              </div>
            </div>
          </header>
          <main style={styles.mainContent}>
            <Routes>
              <Route path="/" />
              <Route path="/login" element={<LoginForm style={styles.card} />} />
              <Route path="/sign_up" element={<SignUpForm style={styles.card} />} />
              <Route path="/forgot_password" element={<ForgotPasswordForm style={styles.card} />} />
            </Routes>
          </main>
        </div>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const styles = {
  page: {
    backgroundColor: '#f8f7f5',
    minHeight: '100vh',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'sans-serif',
  },
  header: {
    padding: '20px',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#f8f7f5',
    padding: '10px',
    display: 'inline-block',
    marginTop: '200px',
    marginBottom: '50px',
  },
  mainContent: {
    display: 'flex',
    justifyContent: 'center',
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    width: '50%',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  logo: {
    width: '200px',
    marginBottom: '30px',
  },
  button: {
    backgroundColor: '#fff', 
    border: '2px solid #dcdcdc',
    borderRadius: '10px',
    width: '100px',
    padding: '10px 25px', 
    fontSize: '16px', 
    color: '#000', 
    cursor: 'pointer', 
    transition: 'background-color 0.3s, border-color 0.3s', 
    textDecoration: 'none',
  },
  button1: {
    marginRight: '5px',
  }
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

const style = document.createElement('style');
style.innerHTML = `
  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: #f8f7f5;
  }
`;
document.head.appendChild(style);