import { healthPrivateApi } from "../../clients";

export const SleepQuality = {
  VERY_POOR: "VERY_POOR",
  POOR: "POOR",
  FAIR: "FAIR",
  GOOD: "GOOD",
  EXCELLENT: "EXCELLENT",
  UNSPECIFIED: "UNSPECIFIED",
} as const;

export type SleepQualityType = (typeof SleepQuality)[keyof typeof SleepQuality];

export const SleepQualityIndexMap: Record<SleepQualityType, number> = {
  [SleepQuality.VERY_POOR]: 0,
  [SleepQuality.POOR]: 1,
  [SleepQuality.FAIR]: 2,
  [SleepQuality.GOOD]: 3,
  [SleepQuality.EXCELLENT]: 4,
  [SleepQuality.UNSPECIFIED]: 5,
};

export const SleepQualityEmojiMap: Record<SleepQualityType, string> = {
  [SleepQuality.VERY_POOR]: "😫",
  [SleepQuality.POOR]: "☹️",
  [SleepQuality.FAIR]: "😐",
  [SleepQuality.GOOD]: "😊",
  [SleepQuality.EXCELLENT]: "⚡",
  [SleepQuality.UNSPECIFIED]: "❓",
};

export const Period = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;

export type PeriodType = (typeof Period)[keyof typeof Period];

export interface SleepEntryRequest {
  start: string; // ISO date string
  end: string; // ISO date string
  quality: number; // Sleep quality as an index (0-5)
}

export interface SleepEntryResponse extends Omit<SleepEntryRequest, "quality"> {
  id: number;
  quality: SleepQualityType;
}

export const addSleepEntry = async (
  sleepEntry: SleepEntryRequest,
): Promise<SleepEntryResponse> => {
  const response = await healthPrivateApi.post("/sleep", sleepEntry);
  return response.data;
};

export const deleteSleepEntryById = async (entryId: number) => {
  await healthPrivateApi.delete(`/sleep/${entryId}`);
};

export const getSleepDurationsForPeriod = async (
  period: PeriodType,
): Promise<SleepEntryResponse[]> => {
  const response = await healthPrivateApi.get(`/sleep/${period}`);
  return response.data;
};

export const getMedianSleepDurationForPeriod = async (
  period: PeriodType,
): Promise<number> => {
  const response = await healthPrivateApi.get(
    `/sleep/${period}/median_duration`,
  );
  return response.data;
};

export const getMedianSleepQualityForPeriod = async (
  period: PeriodType,
): Promise<string> => {
  const response = await healthPrivateApi.get(
    `/sleep/${period}/median_quality`,
  );
  return response.data;
};

export const getSleepHistoryPdfReport = async (): Promise<Blob> => {
  const response = await healthPrivateApi.get("/sleep/download-report", {
    responseType: "blob",
  });
  return response.data;
};
