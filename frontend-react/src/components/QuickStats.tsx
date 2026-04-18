import { useTranslation } from "react-i18next";
import { type WorkoutResponse } from "../services/workoutService";
import { calculateWorkoutVolume } from "../utils/workoutUtils";

interface QuickStatsProps {
  workoutsThisWeek: Array<WorkoutResponse> | undefined;
  isWorkoutsThisWeekLoading: boolean;
  isWorkoutsThisWeekError: boolean;
}

const QuickStats = ({
  workoutsThisWeek,
  isWorkoutsThisWeekLoading,
  isWorkoutsThisWeekError,
}: QuickStatsProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col col-span-3 lg:col-span-1 justify-between rounded-2xl bg-white dark:bg-card-dark p-6 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {t("quickStatsTitle")}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {isWorkoutsThisWeekLoading
                ? "Loading..."
                : isWorkoutsThisWeekError || !workoutsThisWeek
                  ? "--"
                  : workoutsThisWeek.reduce(
                      (a, b) => a + calculateWorkoutVolume(b),
                      0,
                    )}
            </span>
            {!isWorkoutsThisWeekLoading && (
              <span className="text-sm font-medium text-gray-500">kg</span>
            )}
          </div>
        </div>
      </div>
      <div className="mt-6 h-16 w-full">
        <svg
          className="h-full w-full overflow-visible text-primary"
          preserveAspectRatio="none"
          viewBox="0 0 100 40"
        >
          <path
            d="M0 35 C 10 35, 15 20, 25 25 C 35 30, 40 10, 50 15 C 60 20, 65 5, 75 10 C 85 15, 90 2, 100 5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          ></path>
          <defs>
            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="0%"
                stopColor="currentColor"
                stopOpacity="0.2"
              ></stop>
              <stop
                offset="100%"
                stopColor="currentColor"
                stopOpacity="0"
              ></stop>
            </linearGradient>
          </defs>
          <path
            d="M0 35 C 10 35, 15 20, 25 25 C 35 30, 40 10, 50 15 C 60 20, 65 5, 75 10 C 85 15, 90 2, 100 5 V 40 H 0 Z"
            fill="url(#gradient)"
            stroke="none"
          ></path>
        </svg>
      </div>
      <p className="mt-2 text-xs text-gray-400">{t("quickStatsDescription")}</p>
    </div>
  );
};

export default QuickStats;
