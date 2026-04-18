import type { PlanResponse } from "../services/trainingService";

export const calculateAverageTrainingTime = (plan: PlanResponse) => {
  if (plan.planItems.length === 0) return 0;

  const setsAmount = plan.planItems.reduce(
    (total, item) => total + item.defaultSets,
    0
  );
  const timePerSet = 4;
  const totalTime = setsAmount * timePerSet;

  const roundedTime = Math.ceil(totalTime / 15) * 15; // round to nearest 15 minutes
  return roundedTime;
};
