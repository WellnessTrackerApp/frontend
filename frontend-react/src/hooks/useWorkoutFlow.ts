import { useQuery } from "@tanstack/react-query";
import {
  getPredefinedPlans,
  getUserPlans,
  type PlanResponse,
} from "../services/trainingService";
import type { ErrorResponse } from "../types/ApiResponse";
import {
  getPredefinedExercises,
  getUserExercises,
  type ExerciseResponse,
} from "../services/exerciseService";
import { exerciseSorting } from "../utils/sortingUtils";
import {
  transformExercise,
  transformTrainingPlan,
} from "../utils/localizationUtils";
import { useTranslation } from "react-i18next";

export const useAvailablePlans = () => {
  const { t } = useTranslation();

  const userPlans = useQuery<Array<PlanResponse>, ErrorResponse>({
    queryFn: getUserPlans,
    queryKey: ["userPlans"],
    select: (data) =>
      data.map((userPlan) => transformTrainingPlan(userPlan, t)),
  });

  const predefinedPlans = useQuery<Array<PlanResponse>, ErrorResponse>({
    queryFn: getPredefinedPlans,
    queryKey: ["predefinedPlans"],
    select: (data) =>
      data.map((predefinedPlan) => transformTrainingPlan(predefinedPlan, t)),
  });

  const allPlans = [...(userPlans.data || []), ...(predefinedPlans.data || [])];

  return {
    plans: allPlans,
    isLoading: userPlans.isLoading || predefinedPlans.isLoading,
    isError: userPlans.isError || predefinedPlans.isError,
    userPlansOnly: userPlans.data,
  };
};

export const useAvailableExercises = () => {
  const { t } = useTranslation();

  const userExercises = useQuery<Array<ExerciseResponse>, ErrorResponse>({
    queryFn: getUserExercises,
    queryKey: ["userExercises"],
    select: (exercises) =>
      exercises.map((exercise) => transformExercise(exercise, t)),
  });

  const predefinedExercises = useQuery<Array<ExerciseResponse>, ErrorResponse>({
    queryFn: getPredefinedExercises,
    queryKey: ["predefinedExercises"],
    select: (exercises) =>
      exercises.map((exercise) => transformExercise(exercise, t)),
  });

  const allExercises = [
    ...(userExercises.data || []),
    ...(predefinedExercises.data || []),
  ].sort(exerciseSorting);

  return {
    exercises: allExercises,
    isLoading: userExercises.isLoading || predefinedExercises.isLoading,
    isError: userExercises.isError || predefinedExercises.isError,
    userExercisesOnly: userExercises.data,
  };
};
