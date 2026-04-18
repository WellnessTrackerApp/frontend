import { useTranslation } from "react-i18next";
import type { WorkoutResponse } from "../services/workoutService";
import { calculateWorkoutVolume } from "../utils/workoutUtils";

interface WorkoutLogProps {
  workout: WorkoutResponse;
  setSelectedWorkout: (workout: WorkoutResponse) => void;
}

const WorkoutLog = ({ workout, setSelectedWorkout }: WorkoutLogProps) => {
  const { t } = useTranslation();

  return (
    <tr
      className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer"
      onClick={() => setSelectedWorkout(workout)}
    >
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
        {workout.trainingPlan.name}
      </td>
      <td className="px-6 py-4 capitalize">
        {t("dateFormats.monthDay", { date: workout.createdAt })}
      </td>
      <td className="px-6 py-4">{calculateWorkoutVolume(workout)} kg</td>
      <td className="hidden sm:table-cell px-6 py-4">
        <span className="inline-flex my-auto rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-500/10 dark:text-green-400 dark:ring-green-500/20">
          {t("completeStatus")}
        </span>
      </td>
    </tr>
  );
};

export default WorkoutLog;
