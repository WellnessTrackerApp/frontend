import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getWorkouts, type WorkoutResponse } from "../services/workoutService";
import WorkoutDetails from "./modals/WorkoutDetailsModal";
import WorkoutLog from "./WorkoutLog";
import WorkoutLogLoading from "./loaders/WorkoutLogLoading";
import { useTranslation } from "react-i18next";
import { transformWorkout } from "../utils/localizationUtils";

const RecentWorkouts = () => {
  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryFn: () => getWorkouts(null, null, null, 0, 3),
    queryKey: ["recentWorkouts"],
    select: (data) => data.map((workout) => transformWorkout(workout, t)),
  });

  const [selectedWorkout, setSelectedWorkout] =
    useState<WorkoutResponse | null>(null);

  return (
    <>
      <div className="col-span-3 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("recentWorkoutsTitle")}
        </h2>
        <div className="overflow-hidden overflow-x-auto scrollbar-none rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark shadow-sm">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="bg-gray-100 dark:bg-gray-800/50 text-xs uppercase text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3" scope="col">
                  {t("workout")}
                </th>
                <th className="px-6 py-3" scope="col">
                  {t("date")}
                </th>
                <th className="px-6 py-3" scope="col">
                  {t("volume")}
                </th>
                <th className="hidden sm:block px-9 py-3" scope="col">
                  {t("status")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {isLoading || isError || !data ? (
                <WorkoutLogLoading />
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400 font-semibold"
                  >
                    {t("noWorkoutsFound")}
                  </td>
                </tr>
              ) : (
                data.map((workout) => (
                  <WorkoutLog
                    key={workout.workoutId}
                    workout={workout}
                    setSelectedWorkout={setSelectedWorkout}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {selectedWorkout && (
        <WorkoutDetails
          workout={selectedWorkout}
          onClose={() => setSelectedWorkout(null)}
        />
      )}
    </>
  );
};

export default RecentWorkouts;
