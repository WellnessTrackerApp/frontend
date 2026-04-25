import { gymPrivateApi, gymPublicApi } from "../../clients";
import type { GeneralResponse } from "../../types/ApiResponse";

export interface PlanItemResponse {
  exerciseId: number;
  exerciseName: string;
  defaultSets: number;
}

export interface PlanResponse {
  id: number;
  name: string;
  isCustom: boolean;
  planItems: Array<PlanItemResponse>;
}

export interface PlanItemRequest {
  exerciseId: number;
  defaultSets: number;
}

export interface PlanRequest {
  planName: string;
  planItems: Array<PlanItemRequest>;
}

export const getPredefinedPlans = async (): Promise<Array<PlanResponse>> => {
  const response = await gymPublicApi.get("/plans");
  return response.data;
};

export const getUserPlans = async (): Promise<Array<PlanResponse>> => {
  const response = await gymPrivateApi.get("/plans/user");
  return response.data;
};

export const getTrainingPlanById = async (
  trainingPlanId: number,
): Promise<PlanResponse> => {
  const response = await gymPrivateApi.get(`/plans/${trainingPlanId}`);
  return response.data;
};

export const createUserPlan = async (
  requestData: PlanRequest,
): Promise<GeneralResponse> => {
  const response = await gymPrivateApi.post("/plans", requestData);
  return response.data;
};

export const removeTrainingPlan = async (
  trainingPlanId: number,
): Promise<GeneralResponse> => {
  const response = await gymPrivateApi.delete(`/plans/${trainingPlanId}`);
  return response.data;
};

export interface UpdateTrainingPlanProps {
  trainingPlanId: number;
  trainingPlanUpdateRequest: PlanRequest;
}

export const updateTrainingPlan = async ({
  trainingPlanId,
  trainingPlanUpdateRequest,
}: UpdateTrainingPlanProps) => {
  const response = await gymPrivateApi.put(
    `/plans/${trainingPlanId}`,
    trainingPlanUpdateRequest,
  );
  return response.data;
};
