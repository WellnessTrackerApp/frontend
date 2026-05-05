import { healthPrivateApi } from "../../clients";

export type HealthGoalType = "SLEEP" | "STEPS" | "CALORIES" | "ACTIVITY";

export interface HealthGoalRequest {
  healthGoalType: HealthGoalType;
  target: number;
}

export interface HealthGoalResponse {
  id: number;
  healthGoalType: HealthGoalType;
  target: number;
  createdAt: string; // ISO date string
}

export interface HealthGoalProgressResponse {
  goalId: number;
  healthGoalType: HealthGoalType;
  target: number;
  actual: number;
}

export const setHealthGoal = async (
  healthGoal: HealthGoalRequest,
): Promise<HealthGoalResponse> => {
  const response = await healthPrivateApi.post("/goals", healthGoal);
  return response.data;
};

export const deleteHealthGoalByType = async (
  healthGoalType: HealthGoalType,
) => {
  await healthPrivateApi.delete(`/goals/${healthGoalType}`);
};

export const getAllHealthGoals = async (): Promise<HealthGoalResponse[]> => {
  const response = await healthPrivateApi.get("/goals");
  return response.data;
};

export const getGoalsProgress = async (): Promise<
  HealthGoalProgressResponse[]
> => {
  const response = await healthPrivateApi.get("/goals/progress");
  return response.data;
};

export const getSpecificGoalProgress = async (
  healthGoalType: HealthGoalType,
): Promise<HealthGoalProgressResponse> => {
  const response = await healthPrivateApi.get(
    `/goals/progress/${healthGoalType}`,
  );
  return response.data;
};
