import clsx from "clsx";
import { FaChevronRight, FaDumbbell } from "react-icons/fa";
import type { ExerciseResponse } from "../../services/exerciseService";
import { useTranslation } from "react-i18next";

interface ExerciseSelectionOptionProps {
  exercise: ExerciseResponse;
}

const ExerciseSelectionOption = ({
  exercise,
}: ExerciseSelectionOptionProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={clsx(
            "size-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform",
            exercise.isCustom
              ? "bg-blue-500/10 text-blue-400"
              : "bg-purple-500/10 text-purple-400",
          )}
        >
          <FaDumbbell size={20} className="rotate-45" />
        </div>
        <div>
          <p
            className={clsx(
              "font-bold transition-colors",
              exercise.isCustom
                ? "group-hover:text-primary"
                : "group-hover:text-purple-400",
            )}
          >
            {exercise.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">
              {t(
                `exerciseCategories.${exercise.category.toLowerCase()}`,
              ).toLowerCase()}
            </span>
            <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span
              className={clsx(
                "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                exercise.isCustom
                  ? "text-blue-400 bg-blue-400/10"
                  : "text-purple-400 bg-purple-400/10",
              )}
            >
              {exercise.isCustom ? t("your") : t("predefined")}
            </span>
          </div>
        </div>
      </div>
      <FaChevronRight
        className={clsx(
          "text-slate-600 group-hover:translate-x-1 transition-all",
          exercise.isCustom
            ? "group-hover:text-primary"
            : "group-hover:text-purple-400",
        )}
      />
    </div>
  );
};

export default ExerciseSelectionOption;
