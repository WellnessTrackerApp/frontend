import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaBalanceScale,
  FaLanguage,
  FaMoon,
  FaRegCalendar,
  FaUserCircle,
} from "react-icons/fa";
import ProfileSectionLoading from "../components/loaders/ProfileSectionLoading";
import PageWrapper from "../components/ui/PageWrapper";
import { useUserProfile } from "../hooks/useUserProfile";
import type { SupportedLanguage } from "../utils/i18n";

const ProfileSettings = () => {
  const { t, i18n } = useTranslation();

  const {
    data: userProfile,
    isLoading: isUserProfileLoading,
    isError: isUserProfileError,
  } = useUserProfile();

  const showUserProfile =
    !!userProfile && !isUserProfileLoading && !isUserProfileError;

  const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(
    !localStorage.getItem("theme") || localStorage.getItem("theme") === "dark",
  );
  const [preferredWeightUnits, setPreferredWeightUnits] = useState<
    "kg" | "lbs"
  >("kg");
  const [preferredLanguage, setPreferredLanguage] = useState<SupportedLanguage>(
    () => {
      const stored = localStorage.getItem("language");
      return stored === "pl" || stored === "en" ? stored : "en";
    },
  );

  const toggleTheme = () => {
    const html = document.documentElement;
    if (darkModeEnabled) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkModeEnabled(!darkModeEnabled);
  };

  const toggleLanguage = (newLng: SupportedLanguage) => {
    if (preferredLanguage === newLng) return;
    setPreferredLanguage(newLng);
    i18n.changeLanguage(newLng);
    localStorage.setItem("language", newLng);
  };

  return (
    <PageWrapper>
      <div className="p-8 lg:p-12 mx-auto space-y-10">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            {t("settingsTitle")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t("settingsDescription")}
          </p>
        </div>
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="md:text-lg text-md font-bold tracking-tight px-1 text-gray-400 uppercase">
              {t("accountInformation")}
            </h2>
          </div>
          {!showUserProfile ? (
            <ProfileSectionLoading />
          ) : (
            <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-border-dark p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <FaUserCircle className="w-32 h-32 rounded-2xl bg-cover bg-center shrink-0" />
                <div className="flex-1 space-y-4 text-center md:text-left">
                  <div className="space-y-1">
                    <p className="text-3xl font-black text-gray-900 dark:text-white">
                      {userProfile.username}
                    </p>
                    <p className="text-gray-500 font-medium">
                      {userProfile.email}
                    </p>
                    <p className="text-sm text-primary font-semibold flex items-center justify-center md:justify-start gap-1">
                      <FaRegCalendar className="text-sm" />
                      {t("memberSince", {
                        date: new Date(userProfile.createdAt),
                      })}
                    </p>
                  </div>
                  <div className="w-full flex lg:flex-col lg:w-3/4 xl:w-1/2 gap-2">
                    <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 cursor-pointer">
                      {t("editProfile")}
                    </button>
                    <button className="bg-gray-100 dark:bg-border-dark hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2 cursor-pointer">
                      {t("changePassword")}
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute -right-12 -top-12 size-48 bg-primary/5 rounded-full blur-3xl"></div>
            </div>
          )}
        </section>
        <section className="space-y-4">
          <h2 className="md:text-lg font-bold tracking-tight px-1 text-gray-400 uppercase text-md">
            {t("appPreferences")}
          </h2>
          <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-border-dark divide-y divide-gray-100 dark:divide-border-dark">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FaMoon className="text-primary" />
                </div>
                <div>
                  <p className="font-bold">{t("darkMode")}</p>
                  <p className="text-sm text-gray-500">
                    {t("darkModeDescription")}
                  </p>
                </div>
              </div>
              <button
                className={clsx(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer",
                  darkModeEnabled
                    ? "bg-primary hover:bg-primary/80"
                    : "bg-subcomponents-main hover:bg-subcomponents-main/80",
                )}
                onClick={toggleTheme}
              >
                <span
                  className={clsx(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition shadow-sm",
                    darkModeEnabled ? "translate-x-6" : "translate-x-1",
                  )}
                ></span>
              </button>
            </div>
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FaBalanceScale className="text-primary" />
                </div>
                <div>
                  <p className="font-bold">{t("weightUnits")}</p>
                  <p className="text-sm text-gray-500">
                    {t("weightUnitsDescription")}
                  </p>
                </div>
              </div>
              <div className="flex bg-gray-100 dark:bg-border-dark p-1 rounded-xl w-full md:w-32">
                <button
                  className={clsx(
                    "flex-1 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer",
                    preferredWeightUnits === "kg"
                      ? "bg-white dark:bg-card-dark text-primary shadow-sm"
                      : "text-gray-400 dark:hover:text-white",
                  )}
                  onClick={() => setPreferredWeightUnits("kg")}
                >
                  KG
                </button>
                <button
                  className={clsx(
                    "flex-1 py-1.5 rounded-lg font-bold text-xs transition-all text-gray-400 cursor-pointer",
                    preferredWeightUnits === "lbs"
                      ? "bg-white dark:bg-card-dark text-primary shadow-sm"
                      : "text-gray-400 dark:hover:text-white",
                  )}
                  onClick={() => setPreferredWeightUnits("lbs")}
                >
                  LBS
                </button>
              </div>
            </div>
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FaLanguage className="text-primary" />
                </div>
                <div>
                  <p className="font-bold">{t("language")}</p>
                  <p className="text-sm text-gray-500">
                    {t("languageDescription")}
                  </p>
                </div>
              </div>
              <div className="flex bg-gray-100 dark:bg-border-dark p-1 rounded-xl w-full md:w-32">
                <button
                  className={clsx(
                    "flex-1 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer",
                    preferredLanguage === "en"
                      ? "bg-white dark:bg-card-dark text-primary shadow-sm"
                      : "text-gray-400 dark:hover:text-white",
                  )}
                  onClick={() => toggleLanguage("en")}
                >
                  ENG
                </button>
                <button
                  className={clsx(
                    "flex-1 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer",
                    preferredLanguage === "pl"
                      ? "bg-white dark:bg-card-dark text-primary shadow-sm"
                      : "text-gray-400 dark:hover:text-white",
                  )}
                  onClick={() => toggleLanguage("pl")}
                >
                  PL
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default ProfileSettings;
