import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaEye,
  FaListUl,
  FaPen,
  FaStopwatch,
  FaTrashAlt,
} from "react-icons/fa";
import type { ExerciseResponse } from "../services/exerciseService";
import {
  removeTrainingPlan,
  type PlanResponse,
} from "../services/trainingService";
import type { ErrorResponse, GeneralResponse } from "../types/ApiResponse";
import { calculateAverageTrainingTime } from "../utils/plansUtils";
import PlanUpdateModal from "./modals/PlanUpdateModal";
import TrainingPlanDetailsModal from "./modals/TrainingPlanDetailsModal";
import ConfirmationWindow from "./ui/ConfirmationWindow";
import { useTranslation } from "react-i18next";

interface PlanProps {
  plan: PlanResponse;
  exercises: Array<ExerciseResponse>;
  updatable: boolean;
  removable: boolean;
}

const Plan = ({ plan, exercises, updatable, removable }: PlanProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [isPlanExpanded, setIsPlanExpanded] = useState<boolean>(false);
  const [isPlanRemovalWindowOpened, setIsPlanRemovalWindowOpened] =
    useState<boolean>(false);
  const [updatePlan, setUpdatePlan] = useState<PlanResponse | null>(null);

  const planRemoveMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    number
  >({
    mutationFn: removeTrainingPlan,
    onSuccess: (response) => {
      toast.success(response.message);
      queryClient.invalidateQueries({ queryKey: ["userPlans"] });
    },
    onError: (error) => {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleRemovePlan = () => {
    if (planRemoveMutation.isPending) return;

    planRemoveMutation.mutate(plan.id);
  };

  return (
    <>
      <div className="flex flex-col group bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden transition-all duration-300 ring ring-border-light/10 hover:ring-border-light shadow-lg hover:shadow-xl dark:hover:shadow-primary/5 dark:ring dark:ring-white/10 dark:hover:ring-primary/50">
        <div className="p-5 flex flex-col gap-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold leading-tight mb-1">
                {plan.name}
              </h3>
            </div>
            {removable && (
              <button
                className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all cursor-pointer"
                onClick={() => setIsPlanRemovalWindowOpened(true)}
              >
                <FaTrashAlt size={16} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
            <div className="flex items-center gap-1.5">
              <FaListUl size={16} />
              <span>{t("nExercises", { count: plan.planItems.length })}</span>
            </div>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <div className="flex items-center gap-1.5">
              <FaStopwatch size={16} />
              <span>
                {t("nMinutes", { count: calculateAverageTrainingTime(plan) })}
              </span>
            </div>
          </div>
          <div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark flex gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 h-9 rounded-lg bg-background-light hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-sm font-medium transition-colors cursor-pointer"
              onClick={() => setIsPlanExpanded(!isPlanExpanded)}
            >
              <FaEye size={18} />
              {t("view")}
            </button>
            {updatable && (
              <button
                className="flex items-center justify-center h-9 w-9 rounded-lg bg-background-light hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setUpdatePlan(plan);
                }}
              >
                <FaPen size={18} />
              </button>
            )}
          </div>
        </div>

        {isPlanExpanded && (
          <TrainingPlanDetailsModal
            onClose={() => setIsPlanExpanded(false)}
            plan={plan}
            exercises={exercises}
          />
        )}
      </div>

      {updatePlan && (
        <PlanUpdateModal
          exercises={exercises}
          plan={plan}
          onClose={() => setUpdatePlan(null)}
        />
      )}

      {isPlanRemovalWindowOpened && (
        <ConfirmationWindow
          onConfirm={() => {
            handleRemovePlan();
          }}
          onClose={() => setIsPlanRemovalWindowOpened(false)}
          confirmButtonText={t("deletePlanConfirmButtonText")}
          cancelButtonText={t("deletePlanCancelButtonText")}
          windowTitle={t("deletePlanTitle")}
          windowDescription={t("deletePlanDescription")}
        />
      )}
    </>
  );
};

export default Plan;
