import { format } from "date-fns";
import { privateApi } from "../clients";
import type { GeneralResponse } from "../types/ApiResponse";
import type { ExerciseResponse } from "./exerciseService";
import type { PlanResponse } from "./trainingService";

export interface ExerciseSet {
  reps: number;
  weight: number;
}

export interface WorkoutItem {
  exerciseId: number;
  sets: Array<ExerciseSet>;
  type: string;
}

export interface WorkoutCreationRequest {
  trainingId: number;
  workoutItems: Array<WorkoutItem>;
}

export const createWorkout = async (
  workoutCreationRequest: WorkoutCreationRequest
): Promise<GeneralResponse> => {
  const response = await privateApi.post("/workouts", workoutCreationRequest);
  return response.data;
};

export interface SetDetail {
  reps: number;
  weight: number;
}

export interface WorkoutSessionSnapshot {
  workoutId: number;
  workoutDate: string;
  sets: Array<SetDetail>;
}

export interface WorkoutExerciseHistoryResponse {
  exerciseId: number;
  history: Array<WorkoutSessionSnapshot>;
}

export interface WorkoutTrainingHistoryResponse {
  trainingId: number;
  history: Array<WorkoutSessionSnapshot>;
}

export const getWorkoutExerciseHistory = async (
  exerciseId: number,
  previousWorkouts: number = 3
): Promise<WorkoutExerciseHistoryResponse> => {
  const response = await privateApi.get(
    `/workouts/exercises/${exerciseId}/history?previousWorkouts=${previousWorkouts}`
  );
  return response.data;
};

export const getWorkoutExerciseHistoryByWorkoutInPeriod = async (
  exerciseId: number,
  startDate: Date,
  endDate: Date
): Promise<WorkoutExerciseHistoryResponse> => {
  const formattedStartDate = format(startDate, "yyyy-MM-dd");
  const formattedEndDate = format(endDate, "yyyy-MM-dd");
  const response = await privateApi.get(
    `/workouts/exercises/${exerciseId}/history/period?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
  );
  return response.data;
};

export const getWorkoutTrainingHistoryByWorkoutInPeriod = async (
  trainingId: number,
  startDate: Date,
  endDate: Date
): Promise<WorkoutTrainingHistoryResponse> => {
  const formattedStartDate = format(startDate, "yyyy-MM-dd");
  const formattedEndDate = format(endDate, "yyyy-MM-dd");
  const response = await privateApi.get(
    `/workouts/trainings/${trainingId}/history/period?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
  );
  return response.data;
};

export interface WorkoutRepetitionItemResponse {
  exercise: ExerciseResponse;
  sets: Array<ExerciseSet>;
}

export interface WorkoutResponse {
  workoutId: number;
  trainingPlan: PlanResponse;
  createdAt: Date;
  workoutItems: Array<WorkoutRepetitionItemResponse>;
}

export const getWorkouts = async (
  startDate: Date | null,
  endDate: Date | null,
  trainingPlanId: number | null,
  page: number,
  size: number
): Promise<Array<WorkoutResponse>> => {
  const response = await privateApi.get<Array<WorkoutResponse>>(`/workouts`, {
    params: {
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : null,
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : null,
      trainingPlanId: trainingPlanId,
      page: page,
      size: size,
      sort: "createdAt,desc",
    },
  });
  return response.data;
};
