import { healthPrivateApi } from "../../clients";

export type NotificationType =
  | "SLEEP"
  | "LOW_KCAL"
  | "LOW_PROTEIN"
  | "LOW_CARBS"
  | "LOW_FAT"
  | "ACTIVITY";

export interface Notification {
  id: number;
  message: string;
  notificationType: NotificationType;
  updatedAt: string; // ISO string
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await healthPrivateApi.get("/notifications");
  return response.data;
};

export const markNotificationAsRead = async (notificationId: number) => {
  const response = await healthPrivateApi.delete(
    `/notifications/${notificationId}/read`,
  );
  return response.data;
};
