import { Link, BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom";
import LoginForm from "./pages/LoginForm"; //eslint-disable-line

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

        <div class="banner">
          <div class="prodotto">

            <Link to="/login">  <button class="palla" style="--url: url(freepik-export-20241130173751DCNm.png)">
            </button>

            <button class="palla" style="--url: url(1000_F_168326327_hUfexGoYOi9IAB9DFzLY0DvkRHKGBqpi.jpg)">
            </button></Link>
          </div>
        </div>

        <Routes>
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
