import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CurrentUserProvider } from "./client/contexts/CurrentUserContext";
import { CurrentDateProvider } from "./client/contexts/CurrentDateContext";
import App from "./client/App";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      cacheTime: Infinity,
    },
  },
});

hydrateRoot(
  document.getElementById("root"),
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CurrentUserProvider>
          <CurrentDateProvider>
            <App />
          </CurrentDateProvider>
        </CurrentUserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
