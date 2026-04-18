import { Navigate, Outlet } from "react-router";

const ProtectedRoute = () => {
  const tokensAvailable =
    localStorage.getItem("accessToken") !== null ||
    localStorage.getItem("refreshToken") !== null;

  return tokensAvailable ? (
    <Outlet />
  ) : (
    <Navigate to="/register-login" replace />
  );
};

export default ProtectedRoute;
