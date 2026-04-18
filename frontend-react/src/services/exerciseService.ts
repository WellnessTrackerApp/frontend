import type { AxiosResponse } from "axios";
import { privateApi, publicApi } from "../clients";
import type { GeneralResponse } from "../types/ApiResponse";
import { exerciseSorting } from "../utils/sortingUtils";

export const EXERCISE_CATEGORIES = [
  "ARMS",
  "BACK",
  "CHEST",
  "CORE",
  "GENERAL",
  "GLUTES",
  "LEGS",
  "SHOULDERS",
  "UNCATEGORIZED",
] as const;

export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

export interface ExerciseCreationRequest {
  name: string;
  category: string;
}

export interface ExerciseResponse {
  exerciseId: number;
  category: string;
  name: string;
  isCustom: boolean;
}

export const createNewExercise = async (
  newExerciseRequest: ExerciseCreationRequest
): Promise<ExerciseResponse> => {
  const response = await privateApi.post("/exercises", newExerciseRequest);
  return response.data;
};

export const getUserExercises = async (): Promise<Array<ExerciseResponse>> => {
  const response = await privateApi.get<
    unknown,
    AxiosResponse<Array<ExerciseResponse>>,
    unknown
  >("/exercises/user");
  return response.data.sort(exerciseSorting);
};

export const getPredefinedExercises = async (): Promise<
  Array<ExerciseResponse>
> => {
  const response = await publicApi.get("/exercises");
  return response.data;
};

export const removeExercise = async (
  exerciseId: number
): Promise<GeneralResponse> => {
  const response = await privateApi.delete(`/exercises/${exerciseId}`);
  return response.data;
};

export interface UpdateExerciseProps {
  exerciseId: number;
  request: ExerciseCreationRequest;
}

export const updateExercise = async ({
  exerciseId,
  request,
}: UpdateExerciseProps): Promise<ExerciseResponse> => {
  const response = await privateApi.put(`/exercises/${exerciseId}`, request);
  return response.data;
};
