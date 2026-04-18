import { useQuery } from "@tanstack/react-query";
import { startOfWeek } from "date-fns";
import { useTranslation } from "react-i18next";
import { FaRegCalendar } from "react-icons/fa";
import MyPlans from "../components/MyPlans";
import QuickStart from "../components/QuickStart";
import QuickStats from "../components/QuickStats";
import RecentWorkouts from "../components/RecentWorkouts";
import PageWrapper from "../components/ui/PageWrapper";
import { useUserProfile } from "../hooks/useUserProfile";
import { useAvailablePlans } from "../hooks/useWorkoutFlow";
import { getWorkouts } from "../services/workoutService";
import { getCurrentDate } from "../utils/dateUtils";
import { transformWorkout } from "../utils/localizationUtils";

const MainPage = () => {
  const { t } = useTranslation();

  const { plans, isLoading: plansLoading, userPlansOnly } = useAvailablePlans();

  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
  } = useUserProfile();

  const currentDate = getCurrentDate();
  const weekStartDate = startOfWeek(currentDate, { weekStartsOn: 1 });

  const {
    data: workoutsThisWeek,
    isLoading: isWorkoutsThisWeekLoading,
    isError: isWorkoutsThisWeekError,
  } = useQuery({
    queryFn: () => getWorkouts(weekStartDate, currentDate, null, 0, 10_000),
    queryKey: [
      "workoutsThisWeek",
      weekStartDate.getTime(),
      currentDate.getTime(),
    ],
    select: (data) => data.map((workout) => transformWorkout(workout, t)),
  });

  return (
    <PageWrapper>
      <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark scrollbar-none">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 p-6 md:p-10 lg:p-12">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              {isCurrentUserLoading || isCurrentUserError || !currentUser ? (
                <div className="h-10 w-70 bg-gray-200 dark:bg-gray-800 animate-skeleton rounded-lg"></div>
              ) : (
                <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                  {t("welcomeMessage", {
                    username: currentUser.username,
                  })}
                </h1>
              )}
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <FaRegCalendar size={18} />
                <p className="text-sm font-medium capitalize">
                  {t("dateFormats.weekdayDayMonth", { date: currentDate })}
                </p>
              </div>
            </div>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <QuickStart
              plans={plans}
              isPlansLoading={plansLoading}
              workoutsThisWeek={
                workoutsThisWeek ? workoutsThisWeek?.length : null
              }
              isWorkoutsThisWeekLoading={isWorkoutsThisWeekLoading}
              isWorkoutsThisWeekError={isWorkoutsThisWeekError}
            />
            <QuickStats
              workoutsThisWeek={workoutsThisWeek}
              isWorkoutsThisWeekLoading={isWorkoutsThisWeekLoading}
              isWorkoutsThisWeekError={isWorkoutsThisWeekError}
            />
            <MyPlans userPlans={userPlansOnly} plansLoading={plansLoading} />
            <RecentWorkouts />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default MainPage;
