import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  FaBed,
  FaCalendarAlt,
  FaChevronDown,
  FaStopwatch,
  FaUtensils,
  FaWalking,
} from "react-icons/fa";
import Button from "../components/ui/Button";
import PageWrapper from "../components/ui/PageWrapper";
import {
  getGoalsProgress,
  setHealthGoal,
  type HealthGoalRequest,
  type HealthGoalType,
} from "../services/health/healthGoalService";

const HEALTH_GOAL_CONFIG: Record<
  HealthGoalType,
  {
    icon: React.ReactNode;
    bgGradient: string;
    progressBar: string;
    shadow: string;
    label: string;
    unit: string;
  }
> = {
  SLEEP: {
    icon: <FaBed className="text-blue-400 text-2xl" />,
    bgGradient: "bg-blue-500/10",
    progressBar: "bg-blue-500",
    shadow: "shadow-[0_0_8px_rgba(173,198,255,0.4)]",
    label: "Sleep",
    unit: "hrs",
  },
  STEPS: {
    icon: <FaWalking className="text-emerald-400 text-2xl" />,
    bgGradient: "bg-emerald-500/10",
    progressBar: "bg-emerald-500",
    shadow: "shadow-[0_0_8px_rgba(79,219,200,0.4)]",
    label: "Steps",
    unit: "",
  },
  CALORIES: {
    icon: <FaUtensils className="text-orange-400 text-2xl" />,
    bgGradient: "bg-orange-500/10",
    progressBar: "bg-orange-500",
    shadow: "shadow-[0_0_8px_rgba(255,183,134,0.4)]",
    label: "Calories",
    unit: "kcal",
  },
  ACTIVITY: {
    icon: <FaStopwatch className="text-sky-400 text-2xl" />,
    bgGradient: "bg-sky-500/10",
    progressBar: "bg-sky-500",
    shadow: "shadow-[0_0_8px_rgba(77,142,255,0.4)]",
    label: "Weekly Activity",
    unit: "min",
  },
};

const GoalsPage = () => {
  const [healthGoalType, setHealthGoalType] = useState<HealthGoalType>("SLEEP");
  const [targetAmount, setTargetAmount] = useState<number | string>("");

  const queryClient = useQueryClient();

  const setHealthGoalMutation = useMutation({
    mutationFn: setHealthGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["healthGoalsProgress"] });
    },
    onError: () => {
      toast.error(t("goalsPage.failedToSetHealthGoal"));
    },
  });

  const {
    data: healthGoalsProgress,
    isLoading: isHealthGoalsProgressLoading,
    isError: isHealthGoalsProgressError,
  } = useQuery({
    queryFn: getGoalsProgress,
    queryKey: ["healthGoalsProgress", new Date().toDateString()],
  });

  const { t } = useTranslation();

  const validateHealthGoalValue = (
    type: HealthGoalType,
    value: number,
  ): string | null => {
    switch (type) {
      case "SLEEP":
        if (value < 0.5 || value > 24) {
          return t("goalsPage.sleepValidation");
        }
        break;
      case "STEPS":
        if (value <= 0 || value > 100000) {
          return t("goalsPage.stepsValidation");
        }
        break;
      case "CALORIES":
        if (value <= 0 || value > 10000) {
          return t("goalsPage.caloriesValidation");
        }
        break;
      case "ACTIVITY":
        if (value <= 0 || value > 10080) {
          return t("goalsPage.activityValidation");
        }
        break;
    }
    return null;
  };

  const handleSetHealthGoal = () => {
    if (setHealthGoalMutation.isPending) {
      return;
    }

    if (targetAmount === "") {
      toast.error(t("goalsPage.targetAmountRequired"));
      return;
    }

    const targetAmountNumber = parseFloat(targetAmount as string);

    if (isNaN(targetAmountNumber)) {
      toast.error(t("goalsPage.invalidNumber"));
      return;
    }

    const validationError = validateHealthGoalValue(
      healthGoalType,
      targetAmountNumber,
    );
    if (validationError) {
      toast.error(validationError);
      return;
    }

    const healthGoalRequest: HealthGoalRequest = {
      healthGoalType: healthGoalType,
      target: targetAmountNumber,
    };

    setHealthGoalMutation.mutate(healthGoalRequest);
  };

  const handleDiscard = () => {
    setHealthGoalType("SLEEP");
    setTargetAmount("");
  };

  const handleGoalTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHealthGoalType(e.target.value as HealthGoalType);
  };

  const handleTargetValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTargetAmount(e.target.value);
  };

  return (
    <PageWrapper>
      <div className="p-10 lg:px-8 max-w-7xl mx-auto">
        <section className="mb-10">
          <h2 className="text-4xl md:text-5xl font-black dark:text-gray-100 mb-1">
            {t("goalsPage.title")}
          </h2>
          <p className="text-gray-400 dark:text-gray-500 text-base">
            {t("goalsPage.description")}
          </p>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {isHealthGoalsProgressLoading ? (
            <p className="text-gray-600 dark:text-gray-400">
              {t("goalsPage.loadingGoals")}
            </p>
          ) : isHealthGoalsProgressError ? (
            <p className="text-red-600 dark:text-red-400">
              {t("goalsPage.goalsError")}
            </p>
          ) : !healthGoalsProgress || healthGoalsProgress.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              {t("goalsPage.noGoalsFound")}
            </p>
          ) : (
            healthGoalsProgress.map((healthGoalProgress) => {
              const config =
                HEALTH_GOAL_CONFIG[healthGoalProgress.healthGoalType];
              const percentage =
                healthGoalProgress.target > 0
                  ? Math.round(
                      (healthGoalProgress.actual / healthGoalProgress.target) *
                        100,
                    )
                  : 0;

              return (
                <div
                  key={healthGoalProgress.goalId}
                  className="rounded-2xl bg-white dark:bg-slate-900/80 p-6 relative overflow-hidden group border border-gray-200 dark:border-white/5"
                >
                  <div
                    className={`absolute -right-4 -top-4 w-24 h-24 ${config.bgGradient} rounded-full blur-2xl group-hover:opacity-150 transition-opacity`}
                  ></div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 flex items-center justify-center">
                      {config.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {t(`goalsPage.healthGoalLabels.${config.label}`)}
                  </h3>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">
                      {healthGoalProgress.actual}
                    </span>
                    {config.unit && (
                      <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {t(`goalsPage.units.${config.unit}`)}
                      </span>
                    )}
                    <span className="text-gray-600 dark:text-gray-400 mb-1">
                      / {healthGoalProgress.target}{" "}
                      {config.unit && (
                        <span className="text-xs">
                          {t(`goalsPage.units.${config.unit}`)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${config.progressBar} ${config.shadow} transition-all`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div>
          <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900/80 p-8 border border-gray-200 dark:border-white/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                <FaCalendarAlt className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("goalsPage.updateGoalsTitle")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("goalsPage.updateGoalsDescription")}
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {t("goalsPage.goalType")}
                  </label>
                  <div className="relative">
                    <select
                      className="w-full bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                      value={healthGoalType}
                      onChange={handleGoalTypeChange}
                    >
                      <option value="SLEEP">
                        {t("goalsPage.healthGoalTypes.SLEEP")}
                      </option>
                      <option value="STEPS">
                        {t("goalsPage.healthGoalTypes.STEPS")}
                      </option>
                      <option value="CALORIES">
                        {t("goalsPage.healthGoalTypes.CALORIES")}
                      </option>
                      <option value="ACTIVITY">
                        {t("goalsPage.healthGoalTypes.ACTIVITY")}
                      </option>
                    </select>
                    <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {t("goalsPage.targetAmount")}
                  </label>
                  <input
                    className="w-full focus:outline-none bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-600 [&::-webkit-inner-spin-button]:hidden"
                    placeholder={t("goalsPage.enterValue")}
                    value={targetAmount}
                    type="number"
                    onChange={handleTargetValueChange}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <Button
                  btnStyle={"cancel"}
                  size={"big"}
                  additionalStyle="px-6 py-3 rounded-xl font-bold"
                  onClick={handleDiscard}
                >
                  {t("goalsPage.discard")}
                </Button>
                <Button
                  btnStyle={"approve"}
                  size={"big"}
                  additionalStyle="px-10 py-3 rounded-xl text-white! font-bold"
                  onClick={handleSetHealthGoal}
                >
                  {t("goalsPage.saveGoal")}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <section className="mt-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("goalsPage.recentMilestones")}
            </h3>
          </div>
          <div className="rounded-2xl bg-white dark:bg-slate-900/80 overflow-hidden border border-gray-200 dark:border-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-100 dark:bg-white/10 border-b border-gray-200 dark:border-white/5">
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {t("goalsPage.goalCategory")}
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {t("goalsPage.initialTarget")}
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {t("goalsPage.currentResult")}
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {t("goalsPage.status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {healthGoalsProgress?.map((progress) => {
                  const config = HEALTH_GOAL_CONFIG[progress.healthGoalType];
                  const isAchieved = progress.actual >= progress.target;

                  return (
                    <tr
                      key={progress.goalId}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded flex items-center justify-center">
                            {config.icon}
                          </div>
                          <span className="text-gray-900 dark:text-white font-medium">
                            {t(`goalsPage.healthGoalLabels.${config.label}`)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {progress.target} {t(`goalsPage.units.${config.unit}`)}
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">
                        {progress.actual} {t(`goalsPage.units.${config.unit}`)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-[10px] font-bold border ${
                            isAchieved
                              ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-400/20"
                              : "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400 border-yellow-300 dark:border-yellow-400/20"
                          }`}
                        >
                          {isAchieved
                            ? t("goalsPage.achieved")
                            : t("goalsPage.inProgress")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default GoalsPage;
