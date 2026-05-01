import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaClock, FaTimes } from "react-icons/fa";
import {
  deleteSleepEntryById,
  getSleepDurationsForPeriod,
  getSleepHistoryPdfReport,
  Period,
  SleepQuality,
  SleepQualityEmojiMap,
  type PeriodType,
  type SleepQualityType,
} from "../../services/health/sleepService";
import SleepHistoryLoading from "../loaders/SleepHistoryLoading";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";
import Button from "../ui/Button";
import CloseModalButton from "../ui/CloseModalButton";

interface SleepHistoryModalProps {
  onClose: () => void;
}

const SleepHistoryModal = ({ onClose }: SleepHistoryModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [sleepPeriod, setSleepPeriod] = useState<PeriodType>(Period.WEEKLY);

  const {
    data: sleepHistory,
    isError: isSleepHistoryError,
    isLoading: isSleepHistoryLoading,
  } = useQuery({
    queryKey: ["sleepHistory", sleepPeriod, new Date().getDate()],
    queryFn: () => getSleepDurationsForPeriod(sleepPeriod),
    select: (data) =>
      [...data].sort(
        (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime(),
      ),
  });

  const {
    refetch: refetchSleepHistoryReport,
    isFetching: isFetchingSleepHistoryReport,
  } = useQuery({
    queryKey: ["sleepHistoryReport", new Date().getDate()],
    queryFn: getSleepHistoryPdfReport,
    enabled: false,
  });

  const getSleepQualityColor = (quality: SleepQualityType): string => {
    switch (quality) {
      case SleepQuality.VERY_POOR:
        return "#FF4C4C22"; // Red
      case SleepQuality.POOR:
        return "#FF7F5022"; // Coral
      case SleepQuality.FAIR:
        return "#FFD70022"; // Gold
      case SleepQuality.GOOD:
        return "#9ACD3222"; // YellowGreen
      case SleepQuality.EXCELLENT:
        return "#32CD3222"; // LimeGreen
      default:
        return "#80808022"; // Gray for unspecified
    }
  };

  const displayTimeDifference = (start: string, end: string): string => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffInMs = endTime.getTime() - startTime.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.round(
      (diffInMs % (1000 * 60 * 60)) / (1000 * 60),
    );
    return `${diffInHours}h ${diffInMinutes}m`;
  };

  const exportSleepData = () => {
    if (isFetchingSleepHistoryReport) return;

    refetchSleepHistoryReport().then((response) => {
      if (response.error) {
        toast.error(t("wellness.sleepHistoryExportFailed"));
        return;
      }

      if (response.data) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `sleep_history.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success(t("wellness.sleepHistoryExportSuccess"));
      } else {
        toast.error(t("wellness.sleepHistoryExportFailed"));
      }
    });
  };

  const deleteSleepEntryMutation = useMutation({
    mutationFn: deleteSleepEntryById,
    onSuccess: () => {
      toast.success(t("wellness.sleepEntryDeletedSuccessfully"));
      queryClient.invalidateQueries({ queryKey: ["sleepHistory"] });
    },
    onError: () => {
      toast.error(t("wellness.failedToDeleteSleepEntry"));
    },
  });

  const handleSleepEntryDeletion = (entryId: number) => {
    if (deleteSleepEntryMutation.isPending) {
      return;
    }

    deleteSleepEntryMutation.mutate(entryId);
  };

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-gray-800/50">
        <div>
          <p className="text-xl md:text-2xl font-black text-gray-900 dark:text-gray-100">
            {t("wellness.sleepHistory")}
          </p>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {t("wellness.sleepHistoryDescription")}
          </p>
        </div>
        <CloseModalButton onClose={onClose} />
      </header>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5">
        <div className="flex">
          {Object.values(Period).map((period) => (
            <button
              key={period}
              className={clsx(
                "w-full px-4 py-3 font-bold capitalize text-sm md:text-lg",
                period === sleepPeriod
                  ? "bg-blue-500/20 text-blue-500 rounded-lg shadow-inner"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors",
              )}
              onClick={() => setSleepPeriod(period)}
            >
              {t(`wellness.${period}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-900 p-6 space-y-4">
        {isSleepHistoryLoading ? (
          <SleepHistoryLoading />
        ) : isSleepHistoryError ? (
          <p className="text-red-500 dark:text-red-400 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/5">
            {t("wellness.errorLoadingSleepHistory")}
          </p>
        ) : sleepHistory && sleepHistory.length > 0 ? (
          sleepHistory.map((entry) => (
            <div
              key={entry.id}
              className="group flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="h-9 w-9 md:h-12 md:w-12 rounded-lg flex items-center justify-center text-lg md:text-2xl border"
                  style={{
                    backgroundColor: getSleepQualityColor(entry.quality),
                    borderColor: getSleepQualityColor(entry.quality),
                  }}
                >
                  {SleepQualityEmojiMap[entry.quality]}
                </div>
                <div>
                  <p className="text-sm md:text-lg font-bold text-gray-900 dark:text-gray-100">
                    {t("dateFormats.monthDayYear", {
                      date: parseISO(entry.start),
                    })}
                  </p>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <FaClock className="text-[12px] md:text-sm" />
                    <span className="text-xs">
                      {`${format(new Date(entry.start), "HH:mm")} - ${format(new Date(entry.end), "HH:mm")}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-5 items-center text-right group">
                <p className="text-sm md:text-lg font-bold text-blue-600 dark:text-blue-500">
                  {displayTimeDifference(entry.start, entry.end)}
                </p>
                <FaTimes
                  size={20}
                  className="group-hover:block hidden text-red-500 cursor-pointer hover:text-red-600"
                  onClick={() => handleSleepEntryDeletion(entry.id)}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            {t("wellness.noSleepDataForPeriod")}
          </p>
        )}
      </div>
      <footer className="p-6 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
        <Button
          btnStyle={"details"}
          size={"big"}
          children={
            isFetchingSleepHistoryReport
              ? t("wellness.preparingFile")
              : t("wellness.exportData")
          }
          additionalStyle="font-semibold rounded-lg transition-all active:scale-95 text-sm md:text-lg"
          onClick={exportSleepData}
        />
        <Button
          btnStyle={"approve"}
          size={"big"}
          children={t("wellness.closeAnalysis")}
          onClick={onClose}
          additionalStyle="font-bold text-white! rounded-lg transition-all active:scale-95 text-sm md:text-lg"
        />
      </footer>
    </AbsoluteWindowWrapper>
  );
};

export default SleepHistoryModal;
