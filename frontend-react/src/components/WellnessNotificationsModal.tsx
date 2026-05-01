import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import {
  FaBed,
  FaBolt,
  FaCarrot,
  FaDumbbell,
  FaFire,
  FaRunning,
  FaTimes,
} from "react-icons/fa";
import {
  getNotifications,
  markNotificationAsRead,
  type NotificationType,
} from "../services/health/notificationsService";
import NotificationLoading from "./loaders/NotificationLoading";
import AbsoluteWindowWrapper from "./ui/AbsoluteWindowWrapper";
import { useTranslation } from "react-i18next";

interface WellnessNotificationsModalProps {
  onClose: () => void;
}

const NOTIFICATION_ICONS: Record<NotificationType, React.ReactNode> = {
  ACTIVITY: <FaRunning className="text-blue-500" size={18} />,
  SLEEP: <FaBed className="text-indigo-500" size={18} />,
  LOW_KCAL: <FaFire className="text-red-500" size={18} />,
  LOW_PROTEIN: <FaDumbbell className="text-teal-500" size={18} />,
  LOW_CARBS: <FaCarrot className="text-orange-500" size={18} />,
  LOW_FAT: <FaBolt className="text-yellow-500" size={18} />,
};

const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  ACTIVITY: "bg-blue-500/10 text-blue-500",
  SLEEP: "bg-indigo-500/10 text-indigo-500",
  LOW_KCAL: "bg-red-500/10 text-red-500",
  LOW_PROTEIN: "bg-teal-500/10 text-teal-500",
  LOW_CARBS: "bg-orange-500/10 text-orange-500",
  LOW_FAT: "bg-yellow-500/10 text-yellow-500",
};

const WellnessNotificationsModal = ({
  onClose,
}: WellnessNotificationsModalProps) => {
  const { data: notifications, isLoading: isNotificationsLoading } = useQuery({
    queryFn: getNotifications,
    queryKey: ["notifications", new Date().toDateString()],
    select: (data) =>
      data.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
  });

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const deleteNotificationsMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error(t("wellness.failedToDeleteNotification"));
    },
  });

  const handleDeleteNotification = (notificationId: number) => {
    if (deleteNotificationsMutation.isPending) {
      return;
    }

    deleteNotificationsMutation.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    if (!notifications || deleteNotificationsMutation.isPending) {
      return;
    }

    Promise.all(notifications.map((n) => markNotificationAsRead(n.id)))
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      })
      .catch(() => {
        toast.error(t("wellness.failedToDeleteNotification"));
      });
  };

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex justify-between items-center">
        <h3 className="text-xl font-black dark:text-gray-100">
          {t("wellness.notifications")}
        </h3>
        <button
          className="text-xs text-blue-500 hover:text-blue-400 transition-colors font-bold cursor-pointer"
          onClick={handleMarkAllAsRead}
        >
          {t("wellness.markAllAsRead")}
        </button>
      </div>
      <div className="max-h-125 overflow-y-auto">
        {isNotificationsLoading ? (
          <NotificationLoading />
        ) : !notifications || notifications.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm">
              {t("wellness.noNotificationsYet")}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {t("wellness.allCaughtUp")}
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-b border-gray-700 hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    NOTIFICATION_COLORS[notification.notificationType]
                  }`}
                >
                  {NOTIFICATION_ICONS[notification.notificationType]}
                </div>
                <div className="flex justify-between w-full">
                  <div className="flex flex-col gap-1 w-3/4">
                    <span
                      className={`text-xs font-bold tracking-widest uppercase ${
                        NOTIFICATION_COLORS[
                          notification.notificationType
                        ].split(" ")[1]
                      }`}
                    >
                      {t(
                        `wellness.notificationsTypes.${notification.notificationType}`,
                      )}
                    </span>
                    <p className="text-sm text-gray-100 leading-tight">
                      {notification.message}
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400 w-1/4 text-end">
                    {formatDistanceToNow(notification.updatedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <FaTimes
                  size={14}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 cursor-pointer transition-all my-auto"
                  onClick={() => handleDeleteNotification(notification.id)}
                />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-3 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {t("wellness.notificationCount", {
            count: notifications ? notifications.length : 0,
          })}
        </span>
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default WellnessNotificationsModal;
