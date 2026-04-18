import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { type AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaCheck,
  FaChevronRight,
  FaDumbbell,
  FaEllipsisV,
  FaHistory,
  FaPlus,
  FaStopwatch,
  FaSync,
  FaTrashAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAvailableExercises } from "../hooks/useWorkoutFlow";
import type { ExerciseResponse } from "../services/exerciseService";
import type {
  PlanItemResponse,
  PlanResponse,
} from "../services/trainingService";
import {
  createWorkout,
  getWorkoutExerciseHistory,
  getWorkouts,
  type ExerciseSet,
  type WorkoutCreationRequest,
} from "../services/workoutService";
import type { ErrorResponse, GeneralResponse } from "../types/ApiResponse";
import { preventForbiddenInputNumberKeys } from "../utils/inputUtils";
import AutoWorkoutTimer from "./AutoWorkoutTimer";
import ExerciseSelectionOption from "./selections/ExerciseSelectionOption";
import WorkoutDetails from "./modals/WorkoutDetailsModal";
import WorkoutExerciseHistoryModal from "./modals/WorkoutExerciseHistoryModal";
import RestTimer from "./RestTimer";
import ConfirmationWindow from "./ui/ConfirmationWindow";
import SelectOptionWindow from "./ui/SelectOptionWindow";
import { exercisesFilter } from "../utils/exerciseUtils";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { transformWorkout } from "../utils/localizationUtils";

interface WorkoutFormProps {
  plan: PlanResponse;
}

const WorkoutForm = ({ plan }: WorkoutFormProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();

  const [planItemSelectedForDetails, setPlanItemSelectedForDetails] =
    useState<PlanItemResponse | null>(null);
  const [exerciseHistory, setExerciseHistory] =
    useState<PlanItemResponse | null>(null);
  const [isFinishedWorkoutWindowOpen, setIsFinishedWorkoutWindowOpen] =
    useState<boolean>(false);
  const [isCancelWorkoutWindowOpen, setIsCancelWorkoutWindowOpen] =
    useState<boolean>(false);
  const [replacingExerciseId, setReplacingExerciseId] = useState<number | null>(
    null,
  );
  const [isAddExerciseWindowEnabled, setIsAddExerciseWindowEnabled] =
    useState<boolean>(false);
  const [lastWorkoutEnabled, setLastWorkoutEnabled] = useState<boolean>(false);
  const [selectTimerEnabled, setSelectTimerEnabled] = useState<boolean>(false);
  const [selectedTimerOption, setSelectedTimerOption] = useState<number | null>(
    null,
  );
  const [selectedCustomRestTime, setSelectedCustomRestTime] = useState<
    number | null
  >(null);

  const [workoutItems, setWorkoutItems] = useState<Array<PlanItemResponse>>(
    plan.planItems,
  );

  const [workoutCreationRequest, setWorkoutCreationRequest] =
    useState<WorkoutCreationRequest>({
      trainingId: plan.id,
      workoutItems: workoutItems.map((item) => ({
        exerciseId: item.exerciseId,
        type: "REPS",
        sets: Array.from({ length: item.defaultSets }, () => ({
          reps: 0,
          weight: 0,
        })),
      })),
    });

  const TIMER_OPTIONS = [
    { label: t("nSeconds", { count: 30 }), value: 30 },
    { label: t("nMinutes", { count: 1 }), value: 60 },
    { label: t("nMinutes", { count: 2 }), value: 120 },
    { label: t("nMinutes", { count: 3 }), value: 180 },
    { label: t("nMinutes", { count: 4 }), value: 240 },
    { label: t("nMinutes", { count: 5 }), value: 300 },
    { label: t("customTime"), value: -1 },
  ];

  const { exercises, isLoading: isExercisesLoading } = useAvailableExercises();

  const lastSessionResults = useQueries({
    queries: workoutItems.map((item) => ({
      queryKey: ["lastSession", item.exerciseId],
      queryFn: () => getWorkoutExerciseHistory(item.exerciseId, 1),
    })),
  });

  const workoutMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    WorkoutCreationRequest
  >({
    mutationFn: createWorkout,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["lastSession"] });
      queryClient.invalidateQueries({ queryKey: ["workoutsThisWeek"] });
      queryClient.invalidateQueries({ queryKey: ["lastWorkout"] });
      queryClient.invalidateQueries({ queryKey: ["recentWorkouts"] });

      toast.success(response.message);
      navigate("/");
    },
    onError: (error) => {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const {
    data: lastWorkout,
    isLoading: isLastWorkoutLoading,
    isError: isLastWorkoutError,
  } = useQuery({
    queryFn: () => getWorkouts(null, null, plan.id, 0, 1),
    queryKey: ["lastWorkout", "plan", plan.id],
    select: (data) => {
      return data.map((workout) => transformWorkout(workout, t));
    },
  });

  const handleUpdate = (
    exerciseIndex: number,
    setIndex: number,
    field: keyof ExerciseSet,
    newValue: string,
  ) => {
    newValue = newValue.replace(",", ".");
    const numericValue = newValue === "" ? 0 : parseFloat(newValue);

    setWorkoutCreationRequest((prev) => {
      const updatedItems = [...prev.workoutItems];
      const updatedItem = { ...updatedItems[exerciseIndex] };
      const updatedSets = [...updatedItem.sets];
      updatedSets[setIndex] = {
        ...updatedSets[setIndex],
        [field]: numericValue,
      };

      updatedItem.sets = updatedSets;
      updatedItems[exerciseIndex] = updatedItem;

      return {
        ...prev,
        workoutItems: updatedItems,
      };
    });
  };

  const addSetToExercise = (exerciseIndex: number) => {
    setWorkoutCreationRequest((prev) => {
      const updatedWorkoutItems = [...prev.workoutItems];
      const updatedWorkoutItem = { ...updatedWorkoutItems[exerciseIndex] };
      const updatedSets = [...updatedWorkoutItem.sets, { reps: 0, weight: 0 }];
      updatedWorkoutItem.sets = updatedSets;
      updatedWorkoutItems[exerciseIndex] = updatedWorkoutItem;
      return {
        ...prev,
        workoutItems: updatedWorkoutItems,
      };
    });
  };

  const removeSetFromExercise = (exerciseIndex: number, setIndex: number) => {
    setWorkoutCreationRequest((prev) => {
      const updatedItems = [...prev.workoutItems];
      const updatedItem = { ...updatedItems[exerciseIndex] };
      const updatedSets = [
        ...updatedItem.sets.filter((_, index) => index !== setIndex),
      ];
      updatedItem.sets = updatedSets;
      updatedItems[exerciseIndex] = updatedItem;
      return {
        ...prev,
        workoutItems: updatedItems,
      };
    });
  };

  const replaceExercise = (newExercise: ExerciseResponse) => {
    if (
      workoutItems.some((item) => item.exerciseId === newExercise.exerciseId)
    ) {
      toast.error(t("toastMessages.exerciseAlreadyExistsInWorkout"));
      return;
    }

    const updatedItems = workoutItems.map((item) =>
      item.exerciseId === replacingExerciseId
        ? {
            ...item,
            exerciseId: newExercise.exerciseId,
            exerciseName: newExercise.name,
          }
        : { ...item },
    );

    setWorkoutItems(updatedItems);

    setWorkoutCreationRequest((prev) => ({
      ...prev,
      workoutItems: prev.workoutItems.map((workoutItem) =>
        workoutItem.exerciseId === replacingExerciseId
          ? {
              ...workoutItem,
              exerciseId: newExercise.exerciseId,
              sets: workoutItem.sets.map(() => ({ reps: 0, weight: 0 })),
            }
          : workoutItem,
      ),
    }));
  };

  const removeExercise = (exerciseId: number) => {
    const updatedItems = workoutItems.filter(
      (item) => item.exerciseId !== exerciseId,
    );

    setWorkoutItems(updatedItems);

    setWorkoutCreationRequest((prev) => ({
      ...prev,
      workoutItems: prev.workoutItems.filter(
        (workoutItem) => workoutItem.exerciseId !== exerciseId,
      ),
    }));

    queryClient.invalidateQueries({ queryKey: ["lastSession"] });
  };

  const addExercise = (exercise: ExerciseResponse) => {
    if (workoutItems.some((item) => item.exerciseId === exercise.exerciseId)) {
      toast.error(t("toastMessages.exerciseAlreadyExistsInWorkout"));
      return;
    }

    const updatedItems = [
      ...workoutItems,
      {
        exerciseId: exercise.exerciseId,
        exerciseName: exercise.name,
        defaultSets: 1,
      },
    ];

    setWorkoutItems(updatedItems);

    setWorkoutCreationRequest((prev) => ({
      ...prev,
      workoutItems: [
        ...prev.workoutItems,
        {
          exerciseId: exercise.exerciseId,
          type: "REPS",
          sets: [{ reps: 0, weight: 0 }],
        },
      ],
    }));
  };

  const handleFormSubmit = () => {
    if (workoutMutation.isPending) return;

    workoutMutation.mutate(workoutCreationRequest);
  };

  return (
    <div className="bg-background-light dark:bg-background-dark dark:text-white font-display antialiased overflow-x-hidden min-h-screen flex flex-col relative selection:bg-primary/30 pb-8">
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-background-light/90 dark:bg-background-dark/90 border-b border-input-light dark:border-input-dark">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="p-2 -ml-2 rounded-full hover:bg-gray-200 hover:dark:bg-white/5 text-gray-400 hover:text-gray-500 hover:dark:text-white transition-colors cursor-pointer"
              onClick={() => setIsCancelWorkoutWindowOpen(true)}
            >
              <FaArrowLeft />
            </button>
            <div className="hidden md:flex flex-col">
              <h1 className="text-base font-bold leading-tight">{plan.name}</h1>
            </div>
          </div>
          <AutoWorkoutTimer />
          <div className="flex items-center gap-3">
            <button
              className="hidden md:flex h-10 px-5 items-center justify-center rounded-xl bg-[#223149]/50 hover:bg-gray-500 dark:hover:bg-[#223149] border border-input-light dark:border-[#223149] text-white dark:text-gray-300 hover:text-white text-sm font-semibold transition-all cursor-pointer"
              onClick={() => setIsFinishedWorkoutWindowOpen(true)}
            >
              {t("finish")}
            </button>
            <button
              className="hidden md:flex items-center gap-2 h-10 pl-3 pr-4 rounded-xl bg-[#fbac23] hover:bg-[#f59e0b] hover:dark:bg-[#D97706] text-input-dark transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] group cursor-pointer"
              onClick={() => {
                setSelectedTimerOption(null);
                setSelectTimerEnabled(true);
              }}
            >
              <FaStopwatch className="text-[20px] group-hover:animate-pulse" />
              <span className="text-sm font-bold whitespace-nowrap">
                {selectedTimerOption ? (
                  <RestTimer
                    time={selectedTimerOption}
                    disableTimer={() => setSelectedTimerOption(null)}
                  />
                ) : (
                  t("restTimer")
                )}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        <button
          className="md:hidden w-full flex py-1 px-2 items-center justify-center bg-[#223149]/50 hover:bg-gray-500 hover:dark:bg-[#223149] border border-input-light dark:border-[#223149] text-white dark:text-gray-300 hover:text-white text-sm font-semibold transition-all cursor-pointer"
          onClick={() => setIsFinishedWorkoutWindowOpen(true)}
        >
          {t("finish")}
        </button>

        <button
          className="md:hidden w-full flex justify-center items-center gap-2 py-1 pl-3 pr-4 bg-[#fbac23] hover:bg-[#f59e0b] hover:dark:bg-[#D97706] text-input-dark transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] group cursor-pointer"
          onClick={() => {
            setSelectedTimerOption(null);
            setSelectTimerEnabled(true);
          }}
        >
          <FaStopwatch className="text-[20px] group-hover:animate-pulse" />
          <span className="text-sm font-bold whitespace-nowrap">
            {selectedTimerOption ? (
              <RestTimer
                time={selectedTimerOption}
                disableTimer={() => setSelectedTimerOption(null)}
              />
            ) : (
              t("restTimer")
            )}
          </span>
        </button>

        <button
          className="bg-blue-500 text-white dark:bg-blue-900 text-sm font-bold px-2 py-1 w-full border dark:border-gray-800 cursor-pointer hover:bg-blue-600 dark:hover:bg-[#18317e] transition-colors
                   disabled:bg-gray-200 disabled:border-gray-300 disabled:text-gray-400 dark:disabled:text-gray-400 disabled:hover:bg-gray-200 dark:disabled:bg-blue-950 dark:disabled:border-blue-950 dark:disabled:hover:bg-blue-950
                     disabled:cursor-not-allowed disabled:opacity-70"
          onClick={() => setLastWorkoutEnabled(true)}
          disabled={
            isLastWorkoutLoading ||
            isLastWorkoutError ||
            !lastWorkout ||
            lastWorkout.length === 0
          }
        >
          {t("showLastWorkout")}
        </button>
      </div>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-8 pb-8">
        <div className="grid grid-cols-1 gap-8">
          {workoutItems.map((planItem, exerciseIndex) => (
            <article
              key={planItem.exerciseId}
              className="flex flex-col bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden shadow-xl shadow-black/20 group hover:border-primary/30 transition-colors duration-300"
            >
              <div className="flex items-center justify-between p-5 border-b border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-input-light/90 dark:bg-input-dark border-none dark:border-border-dark flex items-center justify-center text-primary shadow-inner">
                    <FaDumbbell size={25} className="rotate-45" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">
                      {planItem.exerciseName}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium capitalize">
                      {t(
                        `exerciseCategories.${
                          exercises
                            .find(
                              (exercise) =>
                                planItem.exerciseId === exercise.exerciseId,
                            )
                            ?.category.toLowerCase() ?? "uncategorized"
                        }`,
                      ).toLowerCase()}
                    </p>
                  </div>
                </div>
                <button
                  className="p-2 rounded-lg hover:bg-white/5 hover:text-text-muted/80 text-text-muted transition-all cursor-pointer"
                  onClick={() => setPlanItemSelectedForDetails(planItem)}
                >
                  <FaEllipsisV size={20} />
                </button>
              </div>
              <div className="p-2 md:p-4">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-xs uppercase tracking-wider text-gray-500 font-semibold text-left">
                      <th className="pl-3 py-3 w-16">{t("set")}</th>
                      <th className="px-2 py-3">kg</th>
                      <th className="px-2 py-3">{t("reps")}</th>
                      <th className="pr-3 py-3 w-14 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {workoutCreationRequest.workoutItems[
                      exerciseIndex
                    ].sets.map((_, setIndex) => {
                      let repsPlaceholder = "0";
                      let weightPlaceholder = "0";

                      if (lastSessionResults[exerciseIndex].isLoading) {
                        repsPlaceholder = "...";
                        weightPlaceholder = "...";
                      } else if (
                        lastSessionResults[exerciseIndex].data?.history?.[0]
                          ?.sets?.[setIndex]
                      ) {
                        const prevSet =
                          lastSessionResults[exerciseIndex].data.history[0]
                            .sets[setIndex];
                        repsPlaceholder = prevSet.reps.toString();
                        weightPlaceholder = prevSet.weight.toString();
                      }

                      return (
                        <tr key={setIndex} className="group/row">
                          <td className="pl-3 py-2">
                            <div className="w-8 h-8 rounded-full bg-input-light dark:bg-input-dark text-gray-500 dark:text-gray-400 flex items-center justify-center text-sm font-bold font-mono">
                              {setIndex + 1}
                            </div>
                          </td>
                          <td className="px-2 py-2">
                            <input
                              className="w-full h-12 bg-input-light/50 dark:bg-input-dark border border-border-light/50 dark:border-border-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-lg text-center font-bold text-lg placeholder-gray-400 dark:placeholder-gray-600 transition-all no-spinner"
                              type="number"
                              step="any"
                              inputMode="decimal"
                              min={0}
                              placeholder={String(weightPlaceholder)}
                              value={
                                workoutCreationRequest.workoutItems[
                                  exerciseIndex
                                ].sets[setIndex].weight === 0
                                  ? ""
                                  : workoutCreationRequest.workoutItems[
                                      exerciseIndex
                                    ].sets[setIndex].weight
                              }
                              onKeyDown={preventForbiddenInputNumberKeys}
                              onChange={(e) =>
                                handleUpdate(
                                  exerciseIndex,
                                  setIndex,
                                  "weight",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td className="px-2 py-2">
                            <input
                              className="w-full h-12 bg-input-light/50 dark:bg-input-dark border border-border-light/50 dark:border-border-dark focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none rounded-lg text-center font-bold text-lg placeholder-gray-400 dark:placeholder-gray-600 transition-all no-spinner"
                              type="number"
                              placeholder={String(repsPlaceholder)}
                              step="1"
                              value={
                                workoutCreationRequest.workoutItems[
                                  exerciseIndex
                                ].sets[setIndex].reps === 0
                                  ? ""
                                  : workoutCreationRequest.workoutItems[
                                      exerciseIndex
                                    ].sets[setIndex].reps
                              }
                              min={1}
                              onChange={(e) =>
                                handleUpdate(
                                  exerciseIndex,
                                  setIndex,
                                  "reps",
                                  e.target.value,
                                )
                              }
                              onKeyDown={(e) => {
                                preventForbiddenInputNumberKeys(e);
                                if (e.key === "." || e.key === ",") {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </td>
                          <td className="pr-3 py-2 text-center">
                            <button
                              className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all cursor-pointer"
                              onClick={() =>
                                removeSetFromExercise(exerciseIndex, setIndex)
                              }
                            >
                              <FaTrashAlt size={20} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="mt-4 px-2">
                  <button
                    className="w-full py-3 rounded-xl border border-dashed border-border-light dark:border-border-dark text-gray-400 hover:text-primary hover:border-primary hover:bg-primary/5 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    onClick={() => addSetToExercise(exerciseIndex)}
                  >
                    <FaPlus size={18} />
                    {t("addSet")}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="w-full flex flex-col gap-5 justify-center px-4 md:px-6 relative pointer-events-auto">
        <button
          className="h-14 px-8 w-53.75 rounded-2xl bg-primary hover:bg-blue-600 text-white shadow-lg shadow-primary/25 border border-white/10 flex justify-center items-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer mx-auto"
          onClick={() => setIsAddExerciseWindowEnabled(true)}
        >
          <FaPlus />
          <span
            className={clsx(
              "font-bold tracking-wide",
              i18n.language === "pl" && "text-sm",
            )}
          >
            {t("addExercise")}
          </span>
        </button>
        <button
          className={clsx(
            "h-14 px-8 w-53.75 mx-auto flex justify-center items-center rounded-2xl bg-[#223149]/50 hover:bg-gray-500 hover:dark:bg-[#223149] border border-input-light dark:border-[#223149] text-white dark:text-gray-300 hover:text-white font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer",
            i18n.language === "pl" && "text-sm",
          )}
          onClick={() => setIsFinishedWorkoutWindowOpen(true)}
        >
          {t("finish")}
        </button>
      </footer>

      {lastWorkoutEnabled && lastWorkout && lastWorkout.length > 0 && (
        <WorkoutDetails
          workout={lastWorkout[0]}
          onClose={() => setLastWorkoutEnabled(false)}
        />
      )}

      {replacingExerciseId && (
        <SelectOptionWindow
          title={t("replaceExercise")}
          onClose={() => setReplacingExerciseId(null)}
          data={exercises}
          dataFilter={exercisesFilter}
          onSelect={(exercise) => {
            replaceExercise(exercise);
            setReplacingExerciseId(null);
          }}
          renderItem={(exercise) => (
            <ExerciseSelectionOption exercise={exercise} />
          )}
          isDataLoading={isExercisesLoading}
        />
      )}

      {isAddExerciseWindowEnabled && (
        <SelectOptionWindow
          title={t("addExercise")}
          onClose={() => setIsAddExerciseWindowEnabled(false)}
          data={exercises}
          dataFilter={exercisesFilter}
          isDataLoading={isExercisesLoading}
          onSelect={(exercise) => addExercise(exercise)}
          renderItem={(exercise) => (
            <ExerciseSelectionOption exercise={exercise} />
          )}
        />
      )}

      {exerciseHistory && (
        <WorkoutExerciseHistoryModal
          planItem={exerciseHistory}
          onClose={() => setExerciseHistory(null)}
        />
      )}

      {isFinishedWorkoutWindowOpen && (
        <ConfirmationWindow
          onConfirm={handleFormSubmit}
          onClose={() => setIsFinishedWorkoutWindowOpen(false)}
          confirmButtonText={t("finishWorkout")}
          cancelButtonText={t("keepTraining")}
          windowTitle={`${t("finishWorkout")}?`}
          windowDescription={t("finishWorkoutDescription")}
        />
      )}

      {isCancelWorkoutWindowOpen && (
        <ConfirmationWindow
          onConfirm={() => {
            toast.success(t("toastMessages.workoutDiscarded"));
            navigate("/");
          }}
          onClose={() => setIsCancelWorkoutWindowOpen(false)}
          confirmButtonText={t("confirm")}
          cancelButtonText={t("keepTraining")}
          windowTitle={`${t("discardWorkout")}?`}
          windowDescription={t("discardWorkoutDescription")}
        />
      )}

      {selectTimerEnabled && (
        <SelectOptionWindow
          title={t("selectTimer")}
          onClose={() => setSelectTimerEnabled(false)}
          data={TIMER_OPTIONS}
          onSelect={(timerOption) => {
            if (timerOption.value === -1) {
              return;
            }
            setSelectedTimerOption(timerOption.value);
            setSelectTimerEnabled(false);
          }}
          renderItem={(timerOption) =>
            timerOption.value === -1 ? (
              <div className="group w-full flex justify-between items-center">
                <input
                  className="w-full no-spinner outline-none font-semibold"
                  type="number"
                  min={1}
                  placeholder={timerOption.label}
                  value={selectedCustomRestTime || ""}
                  onChange={(e) => {
                    setSelectedCustomRestTime(Number(e.target.value));
                  }}
                  onKeyDown={(e) => {
                    preventForbiddenInputNumberKeys(e);
                    if (e.key === "Enter") {
                      if (
                        selectedCustomRestTime == null ||
                        selectedCustomRestTime < 1 ||
                        selectedCustomRestTime > 3600
                      ) {
                        toast.error(
                          t("toastMessages.customRestTimerInvalidRangeMessage"),
                        );
                        return;
                      }
                      setSelectTimerEnabled(false);
                      setSelectedTimerOption(selectedCustomRestTime);
                      setSelectedCustomRestTime(null);
                    }
                  }}
                />
                <div className="cursor-pointer hover:bg-gray-300 hover:dark:bg-slate-700 p-1 rounded-md transition-color group-hover:text-primary">
                  <FaCheck
                    size={20}
                    onClick={() => {
                      if (
                        selectedCustomRestTime == null ||
                        selectedCustomRestTime < 1 ||
                        selectedCustomRestTime > 3600
                      ) {
                        toast.error(
                          t("toastMessages.customRestTimerInvalidRangeMessage"),
                        );
                        return;
                      }
                      setSelectTimerEnabled(false);
                      setSelectedTimerOption(selectedCustomRestTime);
                      setSelectedCustomRestTime(null);
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="group w-full flex justify-between items-center">
                <p
                  className="font-semibold group-hover:text-primary"
                  key={timerOption.value}
                >
                  {timerOption.label}
                </p>
                <FaChevronRight className="group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            )
          }
        />
      )}

      {planItemSelectedForDetails && (
        <SelectOptionWindow
          title={t("workoutExerciseOptions")}
          onClose={() => setPlanItemSelectedForDetails(null)}
          data={[
            { id: "viewHistory", label: t("viewHistory"), icon: <FaHistory /> },
            { id: "replace", label: t("replace"), icon: <FaSync /> },
            { id: "delete", label: t("delete"), icon: <FaTrashAlt /> },
          ]}
          onSelect={(item) => {
            if (item.id === "viewHistory") {
              setExerciseHistory(planItemSelectedForDetails);
            } else if (item.id === "replace") {
              setReplacingExerciseId(planItemSelectedForDetails.exerciseId);
            } else if (item.id === "delete") {
              removeExercise(planItemSelectedForDetails.exerciseId);
              toast.success(t("toastMessages.exerciseRemovedFromWorkout"));
            }
            setPlanItemSelectedForDetails(null);
          }}
          renderItem={(item) => (
            <div className="group flex justify-between items-center w-full">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform bg-blue-500/10 text-blue-400">
                  {item.icon}
                </div>
                <span className="group-hover:text-primary font-semibold">
                  {item.label}
                </span>
              </div>
              <FaChevronRight className="group-hover:translate-x-1 group-hover:text-primary transition-all" />
            </div>
          )}
        />
      )}
    </div>
  );
};

export default WorkoutForm;
