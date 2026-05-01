import { healthPrivateApi } from "../../clients";

export interface DietEntryRequest {
  mealName: string;
  eatenAt: string; // ISO date string
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietEntryResponse {
  id: number;
  mealName: string;
  eatenAt: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

export interface DailyMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const MACROS_KEYS: Array<keyof Omit<DailyMacros, "calories">> = [
  "protein",
  "carbs",
  "fat",
];

export const addDietEntry = async (
  dietEntry: DietEntryRequest,
): Promise<DietEntryResponse> => {
  const response = await healthPrivateApi.post("/diet", dietEntry);
  return response.data;
};

export const deleteDietEntryById = async (entryId: number) => {
  await healthPrivateApi.delete(`/diet/${entryId}`);
};

export const getDailyDietEntries = async (): Promise<DietEntryResponse[]> => {
  const response = await healthPrivateApi.get("/diet");
  return response.data;
};

export const getDailyMacros = async (): Promise<DailyMacros> => {
  const response = await healthPrivateApi.get("/diet/macro");
  return response.data;
};

export const getDietMonthlyPdfReport = async (): Promise<Blob> => {
  const response = await healthPrivateApi.get("/diet/download-report", {
    responseType: "blob",
  });
  return response.data;
};
