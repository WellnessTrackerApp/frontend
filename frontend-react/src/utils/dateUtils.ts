import { differenceInCalendarDays } from "date-fns";
import { t } from "i18next";

export const getCurrentDate = (): Date => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

export const getRelativeDate = (date: Date) => {
  const diff = differenceInCalendarDays(new Date(), date);

  if (diff === 0) return t("dateToday");
  if (diff === 1) return t("dateYesterday");

  return t("dateDaysAgo", { count: diff });
};
