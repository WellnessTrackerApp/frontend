import { useQuery } from "@tanstack/react-query";
import { parseISO } from "date-fns";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { FaHistory } from "react-icons/fa";
import type { PlanItemResponse } from "../../services/trainingService";
import {
  getWorkoutExerciseHistory,
  type WorkoutExerciseHistoryResponse,
} from "../../services/workoutService";
import type { ErrorResponse } from "../../types/ApiResponse";
import WorkoutExerciseHistoryLoading from "../loaders/WorkoutExerciseHistoryLoading";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";
import CloseModalButton from "../ui/CloseModalButton";

interface WorkoutExerciseHistoryModal {
  planItem: PlanItemResponse;
  onClose: () => void;
}

const WorkoutExerciseHistoryModal = ({
  planItem,
  onClose,
}: WorkoutExerciseHistoryModal) => {
  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery<
    WorkoutExerciseHistoryResponse,
    ErrorResponse
  >({
    queryFn: () => getWorkoutExerciseHistory(planItem.exerciseId),
    queryKey: ["exerciseHistory", planItem.exerciseId],
    enabled: !!planItem,
  });

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <div className="w-full mx-auto my-auto">
        <div className="flex items-center justify-between pl-6 pr-4 py-5 border-b border-border-light dark:border-border-dark rounded-t-xl sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2">
              <FaHistory size={20} className="text-primary " />
              <h3 className="tracking-tight text-xl font-bold leading-tight">
                {t("history")}: {planItem.exerciseName}
              </h3>
            </div>
            <p className="text-xs text-gray-400 font-medium mt-1 pl-7">
              {t("progressiveOverloadTracking")}
            </p>
          </div>
          <CloseModalButton onClose={onClose} />
        </div>

        <div className="overflow-y-auto px-6 py-2 custom-scrollbar bg-linear-to-b ">
          <div className="grid grid-cols-[40px_1fr] gap-x-3 relative min-h-30">
            {isError ? (
              <div className="flex justify-center items-center col-span-2">
                <span className="text-lg text-gray-400">
                  {t("fetchingExerciseHistoryFailed")}
                </span>
              </div>
            ) : isLoading ? (
              <WorkoutExerciseHistoryLoading />
            ) : !data || data.history.length === 0 ? (
              <div className="flex justify-center items-center col-span-2">
                <span className="text-lg text-gray-400">
                  {t("noExerciseHistoryMessage")}
                </span>
              </div>
            ) : (
              data.history.map((workoutSessionSnapshot, index) => (
                <Fragment key={index}>
                  <div className="flex flex-col items-center pt-2">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full bg-gray-200 dark:bg-gray-700 mt-5 z-10 ring-4 ring-gray-200 dark:ring-gray-800"></div>
                  </div>
                  <div className="flex flex-col py-5 pl-2 dark:border-t dark:border-gray-700/30 group hover:dark:bg-gray-800/20 rounded-lg transition-colors px-2 -mx-2">
                    <div className="flex justify-between items-baseline mb-3">
                      <p className="dark:text-gray-300 text-base font-semibold group-hover:dark:text-white transition-colors leading-tight">
                        {t("dateFormats.monthDayYear", {
                          date: parseISO(workoutSessionSnapshot.workoutDate),
                        })}
                        <br></br>
                        <span className="text-xs font-normal capitalize">
                          {t("dateFormats.weekday", {
                            date: parseISO(workoutSessionSnapshot.workoutDate),
                          })}
                        </span>
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {workoutSessionSnapshot.sets.map((set, setIndex) => (
                        <div
                          key={setIndex}
                          className="bg-input-light dark:bg-gray-800/80 px-3 py-1.5 rounded-md dark:text-gray-300 border border-border-light dark:border-gray-700 text-sm font-mono flex items-center gap-2"
                        >
                          <span className="text-gray-600">{setIndex + 1}</span>
                          <span className="text-gray-600">|</span>{" "}
                          <span className="font-bold">{set.weight}</span>
                          <span className="text-gray-500">kg</span>
                          <span className="text-gray-500">x</span>{" "}
                          <span className="font-bold">{set.reps}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Fragment>
              ))
            )}
          </div>
        </div>
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default WorkoutExerciseHistoryModal;
