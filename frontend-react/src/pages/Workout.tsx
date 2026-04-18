import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import WorkoutForm from "../components/WorkoutForm";
import {
  getTrainingPlanById,
  type PlanResponse,
} from "../services/trainingService";
import type { ErrorResponse } from "../types/ApiResponse";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import { useTranslation } from "react-i18next";
import { transformTrainingPlan } from "../utils/localizationUtils";

const Workout = () => {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const trainingPlanId = searchParams.get("trainingPlanId");

  const {
    data: plan,
    isLoading,
    isError,
  } = useQuery<PlanResponse, ErrorResponse>({
    queryFn: () => getTrainingPlanById(Number(trainingPlanId!)),
    queryKey: ["trainingPlan", trainingPlanId],
    select: (trainingPlan) => transformTrainingPlan(trainingPlan, t),
    enabled: !!trainingPlanId,
  });

  return (
    <>
      {!trainingPlanId || isError ? (
        <ErrorPage />
      ) : isLoading || !plan ? (
        <LoadingPage
          title={t("loadingWorkoutTitle")}
          description={t("loadingWorkoutDescription")}
        />
      ) : (
        <WorkoutForm key={JSON.stringify(plan)} plan={plan} />
      )}
    </>
  );
};

export default Workout;
