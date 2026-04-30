import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { FaBell, FaMoon, FaUserCircle } from "react-icons/fa";
import SleepMetricLoading from "../components/loaders/SleepMetricLoading";
import Button from "../components/ui/Button";
import PageWrapper from "../components/ui/PageWrapper";
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
import SleepHistoryModal from "../components/modals/SleepHistoryModal";
import { NavLink } from "react-router";

const Wellness = () => {
  const { t } = useTranslation();
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

  const queryClient = useQueryClient();

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
        </div>
        {displaySleepHistory && (
          <SleepHistoryModal onClose={() => setDisplaySleepHistory(false)} />
        )}
      </div>
    </PageWrapper>
  );
};

export default Wellness;
