import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import LoginForm from "./pages/LoginForm";
import SignUpForm from "./pages/SignUpForm";
import ForgotPasswordForm from "./pages/ForgotPasswordForm";

const queryClient = new QueryClient({
  defaultOptions: {
    //It caches the data
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
        <div>
          <header>
            <Link to="/">Selfie!</Link>
            <Link to="/login">Login</Link>
            <Link to="/sign_up">Sign Up</Link>
          </header>
        </div>
        <Routes>
          <Route path="/" />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/sign_up" element={<SignUpForm />} />
          {/*<Route path="/forgot_password" element={<ForgotPasswordForm />} />*/}
          <Route path="/forgot_password" element={<ForgotPasswordForm />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
