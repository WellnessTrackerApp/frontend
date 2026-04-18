import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AxiosInterceptor from "./AxiosInterceptor.tsx";
import "./index.css";
import ErrorPage from "./pages/ErrorPage.tsx";
import MainPage from "./pages/MainPage.tsx";
import PlanManager from "./pages/PlanManager.tsx";
import ProfileSettings from "./pages/ProfileSettings.tsx";
import ProgressPage from "./pages/ProgressPage.tsx";
import ProtectedRoute from "./pages/ProtectedRoute.tsx";
import RegisterLogin from "./pages/RegisterLogin.tsx";
import Workout from "./pages/Workout.tsx";
import "./utils/i18n";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AxiosInterceptor>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MainPage />} />
              <Route path="/plan-manager" element={<PlanManager />} />
              <Route path="/workout" element={<Workout />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/profile" element={<ProfileSettings />} />
            </Route>
            <Route path="/register-login" element={<RegisterLogin />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </AxiosInterceptor>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
