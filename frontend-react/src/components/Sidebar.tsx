import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import clsx from "clsx";
import toast from "react-hot-toast";
import {
  FaChartLine,
  FaCog,
  FaDumbbell,
  FaListAlt,
  FaSignOutAlt,
  FaThLarge,
  FaUserCircle,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "../services/authService";
import type { ErrorResponse, GeneralResponse } from "../types/ApiResponse";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  username: string | undefined;
  isOpen: boolean;
}

const Sidebar = ({ username, isOpen }: SidebarProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const linkStyles = ({ isActive }: { isActive: boolean }) =>
    clsx(
      "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
      isActive
        ? "bg-primary/10 text-primary"
        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
    );

  const signOutMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    { refreshToken: string }
  >({
    mutationFn: signOut,
    onSuccess: (response) => {
      toast.success(response.message);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/register-login");
    },
    onError: (error) => {
      if (error.response?.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleLogout = () => {
    if (signOutMutation.isPending) return;

    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      toast.error(t("toastMessages.userNotLoggedIn"));
      navigate("/register-login", { replace: true });
      return;
    }

    const data = {
      refreshToken: refreshToken,
    };

    signOutMutation.mutate(data);
  };

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 w-72 z-11 flex flex-col justify-between border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-6 transition-transform duration-300 md:translate-x-0 md:static",
        isOpen ? "translate-x-0" : "-translate-x-full",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-8 overflow-y-auto scrollbar-none">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-blue-900/20">
            <FaDumbbell className="w-7 h-7 rotate-45" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
              Gym Tracker
            </h1>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <NavLink className={linkStyles} to="/">
            <FaThLarge size={24} />
            <span className="text-sm font-medium">{t("navDashboard")}</span>
          </NavLink>
          <NavLink className={linkStyles} to="/plan-manager">
            <FaListAlt size={24} />
            <span className="text-sm font-medium">{t("navPlans")}</span>
          </NavLink>
          <NavLink className={linkStyles} to="/progress">
            <FaChartLine size={24} />
            <span className="text-sm font-medium">{t("navProgress")}</span>
          </NavLink>
        </nav>
      </div>

      <div className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-800 pt-6">
        <NavLink className={linkStyles} to="/profile">
          <FaCog size={20} />
          <span className="text-sm font-medium">{t("navSettings")}</span>
        </NavLink>
        <button
          className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          onClick={handleLogout}
        >
          <FaSignOutAlt size={20} className="text-red-400" />
          <span className="text-sm font-medium text-red-400">
            {t("navLogout")}
          </span>
        </button>
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
            <FaUserCircle className="w-full h-full" />
          </div>
          <div className="flex flex-col">
            {username ? (
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {username}
              </span>
            ) : (
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-skeleton"></div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
