import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { format, parseISO, subDays, subMonths, subYears } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaCalendar,
  FaChevronDown,
  FaChevronRight,
  FaDumbbell,
  FaRegCalendar,
} from "react-icons/fa";
import AnalysisPlaceholder from "../components/progress-components/AnalysisPlaceholder";
import ExerciseProgressChart, {
  type ExerciseProgressData,
} from "../components/progress-components/ExerciseProgressChart";
import ProgressChart, {
  type DataContent,
} from "../components/progress-components/ProgressChart";
import ExerciseSelectionOption from "../components/selections/ExerciseSelectionOption";
import TrainingPlanSelectionOption from "../components/selections/TrainingPlanSelectionOption";
import PageWrapper from "../components/ui/PageWrapper";
import SelectOptionWindow from "../components/ui/SelectOptionWindow";
import {
  useAvailableExercises,
  useAvailablePlans,
} from "../hooks/useWorkoutFlow";
import { type ExerciseResponse } from "../services/exerciseService";
import type { PlanResponse } from "../services/trainingService";
import {
  getWorkoutExerciseHistoryByWorkoutInPeriod,
  getWorkoutTrainingHistoryByWorkoutInPeriod,
  type WorkoutExerciseHistoryResponse,
  type WorkoutTrainingHistoryResponse,
} from "../services/workoutService";
import { getCurrentDate } from "../utils/dateUtils";
import { exercisesFilter } from "../utils/exerciseUtils";
import { findMaxLift, findMaxVolume } from "../utils/workoutUtils";

type MetricType = "training" | "exercise";

interface MetricOption {
  label: string;
  value: MetricType;
}

type DateRangeType = "7d" | "30d" | "60d" | "90d" | "6m" | "1y";

interface DateRangeOption {
  label: string;
  value: DateRangeType;
}

type WindowType = "metric" | "range" | "exercise" | "training" | null;

const Progress = () => {
  const { t } = useTranslation();

  const [selectedMetricType, setSelectedMetricType] =
    useState<MetricType>("exercise");
  const [selectedExercise, setSelectedExercise] =
    useState<ExerciseResponse | null>(null);
  const [selectedTraining, setSelectedTraining] = useState<PlanResponse | null>(
    null,
  );
  const [selectedDateRange, setSelectedDateRange] =
    useState<DateRangeType>("7d");
  const [activeWindow, setActiveWindow] = useState<WindowType>(null);

  const currentDate = getCurrentDate();

  const METRIC_OPTIONS: MetricOption[] = [
    { label: t("trainingVolume"), value: "training" },
    { label: t("exercisePerformance"), value: "exercise" },
  ];

  const DATE_RANGE_OPTIONS: DateRangeOption[] = [
    { label: t("lastNDays", { count: 7 }), value: "7d" },
    { label: t("lastNDays", { count: 30 }), value: "30d" },
    { label: t("lastNDays", { count: 60 }), value: "60d" },
    { label: t("lastNDays", { count: 90 }), value: "90d" },
    { label: t("lastNMonths", { count: 6 }), value: "6m" },
    { label: t("lastNYears", { count: 1 }), value: "1y" },
  ];

  const getStartDate = (range: DateRangeType) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    switch (range) {
      case "7d":
        return subDays(now, 7);
      case "30d":
        return subDays(now, 30);
      case "60d":
        return subDays(now, 60);
      case "90d":
        return subDays(now, 90);
      case "6m":
        return subMonths(now, 6);
      case "1y":
        return subYears(now, 1);
    }
  };

  const prepareChartData = (
    data: WorkoutTrainingHistoryResponse,
  ): Array<DataContent> => {
    return data.history.map((snapshot) => ({
      date: format(parseISO(snapshot.workoutDate), "yyyy-MM-dd"),
      value: snapshot.sets.reduce(
        (prev, curr) => prev + curr.reps * curr.weight,
        0,
      ),
    }));
  };

  const prepareExerciseProgressChartData = (
    data: WorkoutExerciseHistoryResponse,
  ): ExerciseProgressData[] => {
    const response: ExerciseProgressData[] = data.history.map((snapshot) => {
      const maxWeight = snapshot.sets.reduce(
        (max, curr) => Math.max(max, curr.weight),
        0,
      );

      return {
        date: format(parseISO(snapshot.workoutDate), "yyyy-MM-dd"),
        volume: snapshot.sets.reduce(
          (prev, curr) => prev + curr.reps * curr.weight,
          0,
        ),
        maxWeight: maxWeight,
      };
    });

    return response;
  };

  const {
    data: exerciseHistoryData,
    isLoading: isExerciseHistoryLoading,
    isError: isExerciseHistoryError,
  } = useQuery({
    queryFn: () =>
      getWorkoutExerciseHistoryByWorkoutInPeriod(
        selectedExercise!.exerciseId,
        getStartDate(selectedDateRange),
        currentDate,
      ),
    queryKey: [
      "exerciseHistory",
      selectedExercise?.exerciseId,
      getStartDate(selectedDateRange),
      currentDate,
    ],
    enabled:
      !!selectedExercise &&
      !!selectedDateRange &&
      selectedMetricType === "exercise",
  });

  const {
    data: trainingHistoryData,
    isLoading: isTrainingHistoryLoading,
    isError: isTrainingHistoryError,
  } = useQuery({
    queryFn: () =>
      getWorkoutTrainingHistoryByWorkoutInPeriod(
        selectedTraining!.id,
        getStartDate(selectedDateRange),
        currentDate,
      ),
    queryKey: [
      "trainingHistory",
      selectedTraining?.id,
      getStartDate(selectedDateRange),
      currentDate,
    ],
    enabled:
      !!selectedTraining &&
      !!selectedDateRange &&
      selectedMetricType === "training",
  });

  const { exercises, isLoading: isExercisesLoading } = useAvailableExercises();
  const { plans: trainingPlans, isLoading: isTrainingPlansLoading } =
    useAvailablePlans();

  const isMetricSelectedWithoutResource = () => {
    return (
      (selectedMetricType === "exercise" && !selectedExercise) ||
      (selectedMetricType === "training" && !selectedTraining)
    );
  };

  const showAnalysisPlaceholder =
    !selectedMetricType || isMetricSelectedWithoutResource();

  const handleMetricChange = (newMetric: MetricType) => {
    if (newMetric === selectedMetricType) return;

    if (newMetric === "exercise") {
      setSelectedTraining(null);
    } else if (newMetric === "training") {
      setSelectedExercise(null);
    }

    setSelectedMetricType(newMetric);
  };

  return (
    <PageWrapper>
      <div className="w-full max-w-350 mx-auto p-6 md:p-8 lg:p-10 space-y-8">
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {t("progressAnalysisTitle")}
            </h2>
            <p className="text-gray-500 text-lg max-w-xl">
              {t("progressAnalysisDescription")}
            </p>
          </div>

          <div className="flex gap-4 bg-white dark:bg-card-dark px-2 py-2 rounded-xl border border-gray-200 dark:border-border-dark shadow-sm">
            <div className="flex flex-col lg:flex-row flex-1 justify-center bg-gray-100 dark:bg-gray-800">
              {METRIC_OPTIONS.map((metricOption, index) => (
                <button
                  key={index}
                  className={clsx(
                    "w-full px-4 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
                    selectedMetricType === metricOption.value
                      ? "bg-gray-50 dark:bg-background-dark text-primary shadow-sm"
                      : "bg-white dark:bg-card-dark dark:hover:bg-gray-700/50 hover:bg-gray-50 text-gray-500 dark:text-gray-400",
                  )}
                  onClick={() => handleMetricChange(metricOption.value)}
                >
                  {metricOption.label}
                </button>
              ))}
            </div>

            <div className="h-14 lg:h-8 my-auto w-px bg-gray-200 dark:bg-border-dark"></div>

            <div className="flex flex-col lg:flex-row flex-1 justify-center">
              {selectedMetricType === "training" && (
                <button
                  className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => {
                    setActiveWindow("training");
                  }}
                >
                  <FaDumbbell
                    size={20}
                    className="hidden lg:block text-gray-400 rotate-45"
                  />
                  <span>
                    {selectedTraining ? selectedTraining.name : t("selectPlan")}
                  </span>
                  <FaChevronDown size={16} className="text-gray-400" />
                </button>
              )}

              {selectedMetricType === "exercise" && (
                <button
                  className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => {
                    setActiveWindow("exercise");
                  }}
                >
                  <FaDumbbell
                    size={20}
                    className="hidden lg:block text-gray-400 rotate-45"
                  />
                  <span>
                    {selectedExercise
                      ? selectedExercise.name
                      : t("selectExercise")}
                  </span>
                  <FaChevronDown size={16} className="text-gray-400" />
                </button>
              )}

              <button
                className="w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors cursor-pointer"
                onClick={() => {
                  setActiveWindow("range");
                }}
              >
                <FaCalendar
                  size={20}
                  className="hidden lg:block text-gray-400"
                />
                <span>
                  {selectedDateRange
                    ? (DATE_RANGE_OPTIONS.find(
                        (dataRangeOption) =>
                          dataRangeOption.value === selectedDateRange,
                      )?.label ?? t("selectDateRange"))
                    : t("selectDateRange")}
                </span>
                <FaChevronDown size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        <section className="">
          <div className="bg-white dark:bg-card-dark rounded-2xl border border-gray-200 dark:border-border-dark p-6 shadow-sm h-110 flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-start mb-8 z-10 relative">
              <div>
                <h3 className="text-lg text-gray-500 uppercase tracking-tight font-bold">
                  {selectedMetricType === "training"
                    ? selectedTraining
                      ? `"${selectedTraining.name}" ${t("volume")}`
                      : t("noTrainingPlanSelected")
                    : selectedExercise
                      ? `"${selectedExercise.name}" ${t("progress")}`
                      : t("noExerciseSelected")}
                </h3>
                {selectedMetricType === "training" && trainingHistoryData ? (
                  selectedTraining ? (
                    <div className="flex items-baseline gap-3 mt-1">
                      {trainingHistoryData.history.length > 0 && (
                        <>
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">
                            {findMaxVolume(trainingHistoryData)}
                          </span>
                          <span className="text-lg font-medium text-gray-400 dark:text-gray-500">
                            kg ({t("highestVolume")})
                          </span>
                        </>
                      )}
                    </div>
                  ) : null
                ) : selectedExercise && exerciseHistoryData ? (
                  <div className="flex items-baseline gap-3 mt-1">
                    {exerciseHistoryData.history.length > 0 && (
                      <>
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {findMaxLift(exerciseHistoryData)}
                        </span>
                        <span className="text-lg font-medium text-gray-400 dark:text-gray-500">
                          kg ({t("highestLift")})
                        </span>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="flex-1 w-full relative z-10">
              {showAnalysisPlaceholder && (
                <AnalysisPlaceholder type={selectedMetricType} />
              )}

              {selectedMetricType === "exercise" && selectedExercise ? (
                isExerciseHistoryError ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <p className="text-2xl text-gray-400">
                      {t("fetchingExerciseHistoryFailed")}
                    </p>
                  </div>
                ) : isExerciseHistoryLoading ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <p className="text-2xl text-gray-400">
                      {t("exerciseHistoryLoading")}
                    </p>
                  </div>
                ) : !exerciseHistoryData ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <p className="text-2xl text-gray-400">
                      {t("noDataAvailable")}
                    </p>
                  </div>
                ) : (
                  <ExerciseProgressChart
                    historyData={prepareExerciseProgressChartData(
                      exerciseHistoryData,
                    )}
                  />
                )
              ) : selectedMetricType === "training" && selectedTraining ? (
                isTrainingHistoryError ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <p className="text-2xl text-gray-400">
                      {t("fetchingTrainingHistoryFailed")}
                    </p>
                  </div>
                ) : isTrainingHistoryLoading ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <p className="text-2xl text-gray-400">
                      {t("trainingHistoryLoading")}
                    </p>
                  </div>
                ) : !trainingHistoryData ? (
                  <div className="flex justify-center items-center w-full h-full">
                    <p className="text-2xl text-gray-400">
                      {t("noDataAvailable")}
                    </p>
                  </div>
                ) : (
                  <ProgressChart
                    historyData={prepareChartData(trainingHistoryData)}
                    yAxisTitle={`${t("trainingVolume")} (kg)`}
                  />
                )
              ) : null}
            </div>
          </div>
        </section>

        <div>
          {activeWindow === "exercise" && (
            <SelectOptionWindow
              title={t("selectExercise")}
              onClose={() => setActiveWindow(null)}
              data={exercises}
              isDataLoading={isExercisesLoading}
              onSelect={(exercise) => {
                setSelectedExercise(exercise);
                setActiveWindow(null);
              }}
              renderItem={(exercise) => (
                <ExerciseSelectionOption exercise={exercise} />
              )}
              dataFilter={exercisesFilter}
            />
          )}

          {activeWindow === "training" && (
            <SelectOptionWindow
              title={t("selectPlan")}
              onClose={() => setActiveWindow(null)}
              data={trainingPlans}
              isDataLoading={isTrainingPlansLoading}
              onSelect={(training) => {
                setSelectedTraining(training);
                setActiveWindow(null);
              }}
              renderItem={(training) => (
                <TrainingPlanSelectionOption plan={training} />
              )}
              dataFilter={(data, keyword) =>
                data.filter((plan) =>
                  plan.name.toLowerCase().includes(keyword.toLowerCase()),
                )
              }
            />
          )}

          {activeWindow === "range" && (
            <SelectOptionWindow
              title={t("selectDateRange")}
              onClose={() => setActiveWindow(null)}
              data={DATE_RANGE_OPTIONS}
              isDataLoading={false}
              onSelect={(item) => {
                setSelectedDateRange(item.value);
                setActiveWindow(null);
              }}
              renderItem={(item) => (
                <div className="w-full flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={
                        "size-12 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                      }
                    >
                      <FaRegCalendar size={20} />
                    </div>
                    <div>
                      <p
                        className={
                          "font-bold group-hover:text-primary transition-colors"
                        }
                      >
                        {item.label}
                      </p>
                    </div>
                  </div>
                  <FaChevronRight
                    className={
                      "text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all"
                    }
                  />
                </div>
              )}
            />
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Progress;
