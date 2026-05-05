import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaBalanceScale,
  FaLanguage,
  FaMoon,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import ProfileSectionLoading from "../components/loaders/ProfileSectionLoading";
import PageWrapper from "../components/ui/PageWrapper";
import { useUserProfile } from "../hooks/useUserProfile";
import type { SupportedLanguage } from "../utils/i18n";
import Button from "../components/ui/Button";
import PhysicalMetricsUpdateModal from "../components/modals/PhysicalMetricsUpdateModal";

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

  const [displayUpdateMetricsModal, setDisplayUpdateMetricsModal] =
    useState<boolean>(false);

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
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="md:text-lg text-md font-bold tracking-tight px-1 text-gray-400 uppercase">
              {t("accountInformation")}
            </h2>
          </div>
          {!showUserProfile ? (
            <ProfileSectionLoading />
          ) : (
            <>
              <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-border-dark p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <FaUserCircle className="w-32 h-32 rounded-2xl bg-cover bg-center shrink-0" />
                  <div className="flex-1 flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                    <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {userProfile.username}
                      </h3>
                      <p className="text-gray-400 font-medium">
                        {userProfile.email}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button className="bg-primary text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-primary/20 cursor-pointer">
                        {t("editProfile")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-border-dark p-6 space-y-6">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                      <FaBalanceScale className="text-base" />
                      {t("physicalMetrics")}
                    </div>
                    <Button
                      btnStyle={"approve"}
                      size={"small"}
                      children={"Update metrics"}
                      additionalStyle="rounded-lg text-white! px-3 py-1 font-bold text-sm"
                      onClick={() => setDisplayUpdateMetricsModal(true)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {t("height")}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {userProfile.height} cm
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {t("userWeight")}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {userProfile.weight} kg
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-border-dark p-6 space-y-6">
                  <div className="flex items-center gap-2 text-gray-400 uppercase text-[10px] font-bold tracking-widest">
                    <FaUser className="text-base" />
                    {t("personalInfo")}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {t("birthDate")}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {t("dateFormats.monthDayYear", {
                          date: new Date(userProfile.birthDate),
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        {t("gender")}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {t(`genders.${userProfile.gender}`)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
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
      {displayUpdateMetricsModal && (
        <PhysicalMetricsUpdateModal
          onClose={() => setDisplayUpdateMetricsModal(false)}
          weight={userProfile?.weight || ""}
          height={userProfile?.height || ""}
        />
      )}
    </PageWrapper>
  );
};

export default ProfileSettings;
