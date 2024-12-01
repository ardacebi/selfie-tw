import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom";
import loginForm from "./pages/loginForm";

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
            <Link to="/" element={<loginForm />}>
              Selfie!
            </Link>
          </header>
        </div>
        <Routes>{/*Empty at the moment*/}</Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
