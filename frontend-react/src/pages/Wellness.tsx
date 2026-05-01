import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import clsx from "clsx";
import { format } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  FaBell,
  FaMoon,
  FaTimes,
  FaUserCircle,
  FaUtensils,
} from "react-icons/fa";
import { NavLink } from "react-router";
import DailyDietEntriesLoading from "../components/loaders/DailyDietEntriesLoading";
import DailyMacrosLoading from "../components/loaders/DailyMacrosLoading";
import SleepMetricLoading from "../components/loaders/SleepMetricLoading";
import MealCreationModal from "../components/modals/MealCreationModal";
import SleepHistoryModal from "../components/modals/SleepHistoryModal";
import Button from "../components/ui/Button";
import PageWrapper from "../components/ui/PageWrapper";
import {
  deleteDietEntryById,
  getDailyDietEntries,
  getDailyMacros,
  getDietMonthlyPdfReport,
  MACROS_KEYS,
} from "../services/health/dietService";
import {
  addSleepEntry,
  getMedianSleepDurationForPeriod,
  getMedianSleepQualityForPeriod,
  Period,
  SleepQuality,
  SleepQualityEmojiMap,
  SleepQualityIndexMap,
  type PeriodType,
  type SleepQualityType,
} from "../services/health/sleepService";

const Wellness = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [sleepStatsPeriod, setSleepStatsPeriod] = useState<PeriodType>(
    Period.WEEKLY,
  );

  const [sleepQuality, setSleepQuality] = useState<SleepQualityType>("FAIR");

  const [logNightSessionDate, setLogNightSessionDate] = useState<string>("");
  const [logNightSessionStartTime, setLogNightSessionStartTime] =
    useState<string>("");
  const [logNightSessionEndTime, setLogNightSessionEndTime] =
    useState<string>("");

  const [displaySleepHistory, setDisplaySleepHistory] =
    useState<boolean>(false);

  const [displayMealCreationModal, setDisplayMealCreationModal] =
    useState<boolean>(false);

  const {
    data: medianSleepDuration,
    isError: isMedianSleepDurationError,
    isLoading: isMedianSleepDurationLoading,
  } = useQuery({
    queryFn: () => getMedianSleepDurationForPeriod(sleepStatsPeriod),
    queryKey: [
      "medianSleepDuration",
      sleepStatsPeriod,
      new Date().toDateString(),
    ],
    retry: false,
  });

  const {
    data: medianSleepQuality,
    isError: isMedianSleepQualityError,
    isLoading: isMedianSleepQualityLoading,
  } = useQuery({
    queryFn: () => getMedianSleepQualityForPeriod(sleepStatsPeriod),
    queryKey: [
      "medianSleepQuality",
      sleepStatsPeriod,
      new Date().toDateString(),
    ],
    retry: false,
  });

  const logNightSessionMutation = useMutation({
    mutationFn: ({ start, end }: { start: string; end: string }) =>
      addSleepEntry({
        start,
        end,
        quality: SleepQualityIndexMap[sleepQuality],
      }),
    onSuccess: () => {
      toast.success(t("wellness.sleepSessionLogged"));
      queryClient.invalidateQueries({
        queryKey: ["medianSleepDuration"],
      });
      queryClient.invalidateQueries({
        queryKey: ["medianSleepQuality"],
      });
    },
    onError: (error: AxiosError<string>) => {
      if (error.response) {
        toast.error(error.response.data);
      } else {
        toast.error(t("wellness.failedToLogSleepSession"));
      }
    },
  });

  const handleLogNightSession = () => {
    if (
      !logNightSessionDate ||
      !logNightSessionStartTime ||
      !logNightSessionEndTime
    ) {
      toast.error(t("wellness.fillInAllFields"));
      return;
    }

    if (logNightSessionStartTime === logNightSessionEndTime) {
      toast.error(t("wellness.startAndEndTimeCannotBeSame"));
      return;
    }

    const start = new Date(
      `${logNightSessionDate}T${logNightSessionStartTime}`,
    );
    const end = new Date(`${logNightSessionDate}T${logNightSessionEndTime}`);

    if (end < start) {
      end.setDate(end.getDate() + 1); // Sleep session goes past midnight
    }

    if (logNightSessionMutation.isPending) {
      return;
    }

    logNightSessionMutation.mutate({
      start: start.toISOString(),
      end: end.toISOString(),
    });
  };

  const formattedMedianSleepDuration = (medianSleepDuration: number) => {
    const minutes = medianSleepDuration * 60;
    const hoursPart = Math.floor(minutes / 60);
    const minutesPart = Math.round(minutes % 60);

    return `${hoursPart}h ${minutesPart}m`;
  };

  const { data: dailyMacros, isLoading: isDailyMacrosLoading } = useQuery({
    queryFn: getDailyMacros,
    queryKey: ["dailyMacros", new Date().toDateString()],
  });

  const { data: dailyDietEntries, isLoading: isDailyDietEntriesLoading } =
    useQuery({
      queryFn: getDailyDietEntries,
      queryKey: ["dailyDietEntries", new Date().toDateString()],
    });

  const deleteDietEntryMutation = useMutation({
    mutationFn: deleteDietEntryById,
    onSuccess: () => {
      toast.success(t("wellness.mealDeletedSuccessfully"));
      queryClient.invalidateQueries({ queryKey: ["dailyDietEntries"] });
      queryClient.invalidateQueries({ queryKey: ["dailyMacros"] });
    },
    onError: () => {
      toast.error(t("wellness.failedToDeleteMealEntry"));
    },
  });

  const {
    refetch: refetchMealHistoryReport,
    isFetching: isFetchingMealHistoryReport,
  } = useQuery({
    queryFn: getDietMonthlyPdfReport,
    queryKey: ["mealHistoryReport", new Date().getDate()],
    enabled: false,
  });

  const handleDietEntryDeletion = (entryId: number) => {
    if (deleteDietEntryMutation.isPending) {
      return;
    }

    deleteDietEntryMutation.mutate(entryId);
  };

  const exportMealData = () => {
    if (isFetchingMealHistoryReport) return;

    refetchMealHistoryReport().then((response) => {
      if (response.data) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `meals_history.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success(t("wellness.mealHistoryExportSuccess"));
      } else {
        toast.error(t("wellness.mealHistoryExportFailed"));
      }
    });
  };

  return (
    <PageWrapper>
      <div className="p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-gray-100">
              {t("wellness.title")}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-sans">
              {t("wellness.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors">
              <FaBell size={24} />
            </button>
            <NavLink
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"
              to="/profile"
            >
              <FaUserCircle size={24} />
            </NavLink>
          </div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <section className="col-span-12 lg:col-span-7 bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-white/5">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-2">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FaMoon
                    size={20}
                    className="text-blue-600 dark:text-blue-500"
                  />
                  {t("wellness.sleepTracking")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t("wellness.sleepTrackingDescription")}
                </p>
              </div>
              <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                <div className="grid [@media(max-width:430px)]:grid-rows-2 [@media(max-width:430px)]:grid-cols-2 grid-cols-4 md:grid-rows-2 md:grid-cols-2 xl:grid-cols-4 xl:grid-rows-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-white/5">
                  {Object.values(Period).map((period) => (
                    <button
                      key={period}
                      className={clsx(
                        "px-4 py-1.5 text-xs font-bold",
                        period === sleepStatsPeriod
                          ? "bg-blue-500/20 text-blue-600 dark:text-blue-500 rounded-lg shadow-inner capitalize"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors capitalize",
                      )}
                      onClick={() => {
                        setSleepStatsPeriod(period);
                      }}
                    >
                      {t(`wellness.${period}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {t("wellness.medianDuration")}
                </p>
                <div className="flex items-baseline gap-2">
                  {isMedianSleepDurationLoading ? (
                    <SleepMetricLoading />
                  ) : (
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-2xl xl:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                      {isMedianSleepDurationError
                        ? "--"
                        : formattedMedianSleepDuration(medianSleepDuration!)}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                  {t("wellness.medianQuality")}
                </p>
                <div className="flex items-baseline gap-2">
                  {isMedianSleepQualityLoading ? (
                    <SleepMetricLoading />
                  ) : (
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-2xl xl:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                      {isMedianSleepQualityError
                        ? "--"
                        : t(`wellness.qualityLabels.${medianSleepQuality}`)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <hr className="border-t border-gray-200 dark:border-white/5 mt-8" />
            <div>
              <p className="text-xl border-spacing-1 uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mt-10 mb-6 flex items-center gap-2">
                {t("wellness.logNightSession")}
              </p>
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <label className="block text-sm text-gray-600 dark:text-gray-400">
                    {t("wellness.sleepDuration")}
                  </label>
                  <div className="grid gap-x-4 gap-y-1">
                    <div>
                      <label className="text-sm text-gray-700 dark:text-gray-300">
                        {t("wellness.sessionDate")}
                      </label>
                      <input
                        className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg p-3 text-gray-900 dark:text-gray-100 select-none outline-none focus:ring-2 focus:ring-blue-500/50 [&::-webkit-calendar-picker-indicator]:hidden"
                        onClick={(e) => e.currentTarget.showPicker()}
                        onChange={(e) => setLogNightSessionDate(e.target.value)}
                        type="date"
                      />
                    </div>
                    <div className="flex flex-col gap-y-1 xl:flex-row xl:gap-x-3">
                      <div className="w-full">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                          {t("wellness.wentToBedAt")}
                        </label>
                        <input
                          className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg p-3 text-gray-900 dark:text-gray-100 select-none outline-none focus:ring-2 focus:ring-blue-500/50 [&::-webkit-calendar-picker-indicator]:hidden"
                          onClick={(e) => e.currentTarget.showPicker()}
                          onChange={(e) =>
                            setLogNightSessionStartTime(e.target.value)
                          }
                          type="time"
                        />
                      </div>
                      <div className="w-full">
                        <label className="text-sm text-gray-700 dark:text-gray-300">
                          {t("wellness.wokeUpAt")}
                        </label>
                        <input
                          className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-lg p-3 text-gray-900 dark:text-gray-100 select-none outline-none focus:ring-2 focus:ring-blue-500/50 [&::-webkit-calendar-picker-indicator]:hidden"
                          onClick={(e) => e.currentTarget.showPicker()}
                          onChange={(e) =>
                            setLogNightSessionEndTime(e.target.value)
                          }
                          type="time"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm text-gray-600 dark:text-gray-400">
                    {t("wellness.sleepQuality")}
                  </label>
                  <div className="grid grid-rows-3 grid-cols-2 gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    {Object.values(SleepQuality).map((quality) => (
                      <button
                        key={quality}
                        className={clsx(
                          "flex flex-col py-2 px-2 rounded-md text-xl",
                          quality == sleepQuality
                            ? "bg-blue-500/20 border border-blue-500/30 text-blue-500"
                            : "hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-400",
                        )}
                        onClick={() => setSleepQuality(quality)}
                      >
                        {SleepQualityEmojiMap[quality]}
                        <span className="text-xs mt-1 wrap-break-word">
                          {t(`wellness.qualityLabels.${quality}`)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-end justify-between gap-6">
              <Button
                btnStyle={"approve"}
                size={"big"}
                children={t("wellness.logSleep")}
                additionalStyle="font-bold text-white! px-8 py-3 rounded-lg active:scale-95 transition-all"
                onClick={handleLogNightSession}
              />
              <Button
                btnStyle={"details"}
                size={"big"}
                children={t("wellness.viewHistory")}
                additionalStyle="font-bold px-8 py-3 rounded-lg active:scale-95 transition-all"
                onClick={() => setDisplaySleepHistory(true)}
              />
            </div>
          </section>
          <section className="col-span-12 lg:col-span-5 bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-white/5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FaUtensils size={20} className="text-teal-500" />
                {t("wellness.mealTracking")}
              </h3>
            </div>
            <div className="mb-8 p-4 rounded-xl bg-gray-100 dark:bg-gray-900">
              {isDailyMacrosLoading ? (
                <DailyMacrosLoading />
              ) : (
                <>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xl text-gray-500 dark:text-gray-400">
                      {t("wellness.todaysIntake")}
                    </p>
                    <p className="text-2xl sm:text-3xl md:text-4xl lg:text-2xl xl:text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                      <span className="text-teal-500">
                        {dailyMacros ? dailyMacros.calories : "--"}
                      </span>{" "}
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                        {t("wellness.kcal")}
                      </span>
                    </p>
                  </div>

                  <div className="flex justify-between mt-5">
                    {MACROS_KEYS.map((key) => (
                      <div key={key} className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                          {t(`wellness.${key}`)}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {dailyMacros ? dailyMacros[key] : "-- "}g
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <hr className="border-t border-gray-200 dark:border-white/5 mb-8" />
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-900 max-h-75">
              <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
                {t("wellness.todaysMeals")}
              </h4>
              {isDailyDietEntriesLoading ? (
                <DailyDietEntriesLoading />
              ) : !dailyDietEntries || dailyDietEntries.length == 0 ? (
                <p className="font-bold">{t("wellness.noData")}</p>
              ) : (
                <div className="space-y-3">
                  {dailyDietEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {entry.mealName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                            {format(entry.eatenAt, "HH:mm a")}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded font-bold">
                              P: {entry.proteins}g
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded font-bold">
                              C: {entry.carbs}g
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded font-bold">
                              F: {entry.fats}g
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 items-center">
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          {entry.calories}{" "}
                          <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
                            {t("wellness.kcal")}
                          </span>
                        </p>
                        <FaTimes
                          size={16}
                          className="group-hover:block hidden text-red-500 cursor-pointer hover:text-red-600"
                          onClick={() => handleDietEntryDeletion(entry.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-row items-end justify-between gap-6 mt-auto">
              <Button
                btnStyle={"approve"}
                size={"big"}
                children={t("wellness.addMeal")}
                additionalStyle="rounded-lg text-white! bg-teal-500! hover:bg-teal-600! font-bold px-8 py-3 active:scale-95 transition-all"
                onClick={() => setDisplayMealCreationModal(true)}
              />
              <Button
                btnStyle={"details"}
                size={"big"}
                children={t("wellness.exportData")}
                additionalStyle="rounded-lg text-teal-500! border-teal-500 hover:text-teal-300! hover:border-teal-300 font-bold px-8 py-3 active:scale-95 transition-all"
                onClick={exportMealData}
              />
            </div>
          </section>
        </div>
        {displaySleepHistory && (
          <SleepHistoryModal onClose={() => setDisplaySleepHistory(false)} />
        )}
        {displayMealCreationModal && (
          <MealCreationModal
            onClose={() => setDisplayMealCreationModal(false)}
          />
        )}
      </div>
    </PageWrapper>
  );
};

export default Wellness;
