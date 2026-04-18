import clsx from "clsx";
import { FaChevronRight, FaDumbbell } from "react-icons/fa";
import type { PlanResponse } from "../../services/trainingService";
import { useTranslation } from "react-i18next";

interface TrainingPlanSelectionOptionProps {
  plan: PlanResponse;
}

const TrainingPlanSelectionOption = ({
  plan,
}: TrainingPlanSelectionOptionProps) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div
          className={clsx(
            "size-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform",
            plan.isCustom
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
              plan.isCustom
                ? "group-hover:text-primary"
                : "group-hover:text-purple-400",
            )}
          >
            {plan.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {t("nExercises", { count: plan.planItems.length })}
            </span>
            <span className="size-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
            <span
              className={clsx(
                "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                plan.isCustom
                  ? "text-blue-400 bg-blue-400/10"
                  : "text-purple-400 bg-purple-400/10",
              )}
            >
              {plan.isCustom ? t("your") : t("predefined")}
            </span>
          </div>
        </div>
      </div>
      <FaChevronRight
        className={clsx(
          "text-slate-600 group-hover:translate-x-1 transition-all",
          plan.isCustom
            ? "group-hover:text-primary"
            : "group-hover:text-purple-400",
        )}
      />
    </div>
  );
};

export default TrainingPlanSelectionOption;
