import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { type PlanResponse } from "../services/trainingService";
import TrainingPlanSelectionOption from "./selections/TrainingPlanSelectionOption";
import SelectOptionWindow from "./ui/SelectOptionWindow";
import { Trans, useTranslation } from "react-i18next";

interface QuickStartProps {
  plans: Array<PlanResponse>;
  isPlansLoading: boolean;
  workoutsThisWeek: number | null;
  isWorkoutsThisWeekLoading: boolean;
  isWorkoutsThisWeekError: boolean;
}

const QuickStart = ({
  plans: data,
  isPlansLoading: isLoading,
  workoutsThisWeek,
  isWorkoutsThisWeekLoading,
  isWorkoutsThisWeekError,
}: QuickStartProps) => {
  const { t } = useTranslation();

  const [selectWorkoutEnabled, setSelectWorkoutEnabled] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const handleWorkoutStart = (trainingPlan: PlanResponse) => {
    toast.success(
      t("toastMessages.workoutStartMessage", { planName: trainingPlan.name }),
    );
    navigate("/workout?trainingPlanId=" + trainingPlan.id);
  };

  return (
    <>
      <div className="col-span-3 lg:col-span-2 relative rounded-2xl bg-white dark:bg-card-dark p-6 md:p-8 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full dark:bg-primary/10 blur-3xl"></div>
        <div className="relative z-10 flex h-full flex-col justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("quickStartTitle")}
            </h2>
            <p className="max-w-md text-gray-500 dark:text-gray-400">
              {isWorkoutsThisWeekError ? (
                <span>{t("fetchingWorkoutsFailed")}</span>
              ) : isWorkoutsThisWeekLoading || workoutsThisWeek == null ? (
                <span>{t("workoutsLoading")}</span>
              ) : (
                <Trans
                  i18nKey="quickStartDescription"
                  values={{ count: workoutsThisWeek }}
                  components={{
                    1: <span className="text-primary font-bold" />,
                  }}
                />
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-600 hover:shadow-blue-500/30 active:scale-95 cursor-pointer"
              onClick={() => setSelectWorkoutEnabled(true)}
            >
              <FaPlay />
              {t("startWorkoutButton")}
            </button>
          </div>
        </div>
      </div>

      {selectWorkoutEnabled && (
        <SelectOptionWindow
          title={t("selectPlan")}
          onClose={() => setSelectWorkoutEnabled(false)}
          data={data}
          isDataLoading={isLoading}
          dataFilter={(data, keyword) =>
            data.filter((plan) =>
              plan.name.toLowerCase().includes(keyword.toLowerCase()),
            )
          }
          onSelect={(item) => handleWorkoutStart(item)}
          renderItem={(plan) => <TrainingPlanSelectionOption plan={plan} />}
        />
      )}
    </>
  );
};

export default QuickStart;
