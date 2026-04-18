import { FaDumbbell, FaPen, FaTrashAlt } from "react-icons/fa";
import type { ExerciseResponse } from "../services/exerciseService";
import { useState } from "react";
import ConfirmationWindow from "./ui/ConfirmationWindow";
import { useTranslation } from "react-i18next";

interface ExerciseProps {
  exercise: ExerciseResponse;
  setUpdateExercise: (exercise: ExerciseResponse) => void;
  handleRemoveExercise: (exerciseId: number) => void;
}

const Exercise = ({
  exercise,
  setUpdateExercise,
  handleRemoveExercise,
}: ExerciseProps) => {
  const { t } = useTranslation();

  const [isExerciseRemovalWindowOpened, setIsExerciseRemovalWindowOpened] =
    useState<boolean>(false);
  return (
    <div className="flex flex-col group bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden transition-all duration-300 ring ring-border-light/10 hover:ring-border-light shadow-lg hover:shadow-xl dark:hover:shadow-primary/5 dark:ring dark:ring-white/10 dark:hover:ring-primary/50">
      <div className="p-5 flex flex-col justify-between gap-4 flex-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center justify-between gap-3 w-full">
            <h3 className="text-lg font-bold leading-tight mb-1">
              {exercise.name}
            </h3>
            <div className="flex gap-1">
              <button
                className="flex items-center justify-center h-7 w-7 rounded-lg border border-border-light dark:border-border-dark text-gray-400 hover:text-gray-500 hover:border-gray-500 hover:dark:text-white hover:dark:border-gray-500 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdateExercise(exercise);
                }}
              >
                <FaPen size={14} />
              </button>
              <button
                className="flex items-center justify-center h-7 w-7 rounded-lg border border-border-light dark:border-border-dark text-gray-400 hover:text-red-400 hover:border-red-400 transition-colors cursor-pointer"
                onClick={() => setIsExerciseRemovalWindowOpened(true)}
              >
                <FaTrashAlt size={14} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-1.5">
            <FaDumbbell size={15} className="rotate-45" />
            <span className="capitalize">
              {t(
                `exerciseCategories.${exercise.category.toLowerCase()}`,
              ).toLowerCase()}
            </span>
          </div>
        </div>
      </div>
      {isExerciseRemovalWindowOpened && (
        <ConfirmationWindow
          onConfirm={() => {
            handleRemoveExercise(exercise.exerciseId);
          }}
          onClose={() => setIsExerciseRemovalWindowOpened(false)}
          confirmButtonText={t("deleteExerciseConfirmButtonText")}
          cancelButtonText={t("deleteExerciseCancelButtonText")}
          windowTitle={t("deleteExerciseTitle")}
          windowDescription={t("deleteExerciseDescription")}
        />
      )}
    </div>
  );
};

export default Exercise;
