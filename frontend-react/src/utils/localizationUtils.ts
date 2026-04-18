import type { TFunction } from "i18next";
import type { ExerciseResponse } from "../services/exerciseService";
import type { PlanResponse } from "../services/trainingService";
import type {
  WorkoutRepetitionItemResponse,
  WorkoutResponse,
} from "../services/workoutService";

export const transformExercise = (
  exercise: ExerciseResponse,
  t: TFunction,
) => ({
  ...exercise,
  name: exercise.isCustom
    ? exercise.name
    : t(`exercises.${exercise.name}`, exercise.name),
});

export const transformTrainingPlan = (plan: PlanResponse, t: TFunction) => ({
  ...plan,
  name: plan.isCustom ? plan.name : t(`trainingPlans.${plan.name}`, plan.name),
  planItems: plan.planItems.map((planItem) => ({
    ...planItem,
    exerciseName: t(
      `exercises.${planItem.exerciseName}`,
      planItem.exerciseName,
    ),
  })),
});

export const transformWorkoutItem = (
  workoutItem: WorkoutRepetitionItemResponse,
  t: TFunction,
) => ({
  ...workoutItem,
  exercise: transformExercise(workoutItem.exercise, t),
});

export const transformWorkout = (workout: WorkoutResponse, t: TFunction) => {
  const createdAt = new Date(workout.createdAt);
  createdAt.setHours(0, 0, 0, 0);
  return {
    ...workout,
    trainingPlan: transformTrainingPlan(workout.trainingPlan, t),
    workoutItems: workout.workoutItems.map((workoutItem) =>
      transformWorkoutItem(workoutItem, t),
    ),
    createdAt: new Date(createdAt),
  };
};
