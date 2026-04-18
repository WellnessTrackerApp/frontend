import toast from "react-hot-toast";
import { FaDumbbell, FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { ExerciseResponse } from "../../services/exerciseService";
import type { PlanResponse } from "../../services/trainingService";
import { calculateAverageTrainingTime } from "../../utils/plansUtils";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";
import CloseModalButton from "../ui/CloseModalButton";
import { Trans, useTranslation } from "react-i18next";

interface TrainingPlanDetailsModalProps {
  onClose: () => void;
  plan: PlanResponse;
  exercises: Array<ExerciseResponse>;
}

const TrainingPlanDetailsModal = ({
  onClose,
  plan,
  exercises,
}: TrainingPlanDetailsModalProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleWorkoutStart = (trainingPlan: PlanResponse) => {
    toast.success(
      t("toastMessages.workoutStartMessage", {
        planName: trainingPlan.name,
      }),
    );
    navigate("/workout?trainingPlanId=" + trainingPlan.id);
  };

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <div className="flex items-center justify-between pl-6 pr-4 py-5 border-b border-border-light dark:border-border-dark rounded-t-xl sticky top-0 z-20">
        <div>
          <div className="flex items-center gap-3">
            <FaDumbbell size={20} className="text-primary rotate-45" />
            <h3 className="tracking-tight text-xl font-bold leading-tight">
              {plan.name}
            </h3>
          </div>
        </div>
        <CloseModalButton onClose={onClose} />
      </div>
      <div className="overflow-y-auto px-6 py-6 scrollbar-none bg-linear-to-b space-y-4">
        {plan.planItems.map((planItem) => (
          <div
            key={planItem.exerciseId}
            className="bg-input-light dark:bg-gray-800/40 border border-border-light dark:border-border-dark rounded-xl p-5 hover:bg-input-light/50 hover:dark:bg-gray-800/60 transition-colors group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-bold">{planItem.exerciseName}</h4>
                <span className="text-xs text-gray-400 font-medium tracking-wide capitalize">
                  {t(
                    `exerciseCategories.${
                      exercises
                        .find(
                          (exercise) =>
                            exercise.exerciseId === planItem.exerciseId,
                        )
                        ?.category.toLowerCase() ?? "uncategorized"
                    }`,
                  ).toLowerCase()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-selection-light dark:bg-black/20 rounded-lg p-4 border border-border-light dark:border-border-dark">
              <div className="flex-1">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1">
                  {t("volumeProtocol")}
                </p>
                <div className="flex items-baseline gap-2">
                  <Trans
                    i18nKey="nSets"
                    values={{ count: planItem.defaultSets }}
                    components={{
                      1: <span className="text-2xl font-black"></span>,
                      2: (
                        <span className="text-sm text-gray-400 font-medium uppercase tracking-wider"></span>
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 border-t border-border-light dark:border-border-dark flex justify-between items-center rounded-b-xl">
        <div>
          <span className="text-md font-medium text-gray-500">
            ~{t("nMinutes", { count: calculateAverageTrainingTime(plan) })}
          </span>
          <span className="text-md font-medium text-gray-500"> | </span>
          <span className="text-md font-medium text-gray-500">
            {t("nExercises", { count: plan.planItems.length })}
          </span>
        </div>
        <button
          className="bg-primary hover:bg-blue-600 active:scale-95 text-white text-sm font-bold py-2 px-6 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center gap-2 cursor-pointer"
          onClick={() => handleWorkoutStart(plan)}
        >
          {t("startWorkout")}
          <FaPlay size={18} />
        </button>
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default TrainingPlanDetailsModal;
