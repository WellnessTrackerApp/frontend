import { useTranslation } from "react-i18next";
import { FaChartLine } from "react-icons/fa";
import type { WorkoutResponse } from "../../services/workoutService";
import {
  calculateTotalSets,
  calculateWorkoutVolume,
} from "../../utils/workoutUtils";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";
import CloseModalButton from "../ui/CloseModalButton";

interface WorkoutDetailsProps {
  workout: WorkoutResponse;
  onClose: () => void;
}

const WorkoutDetails = ({ workout, onClose }: WorkoutDetailsProps) => {
  const { t } = useTranslation();

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <div className="flex-1 overflow-y-auto scrollbar-none p-5 space-y-10">
        <header className="flex items-center justify-between p-6 md:p-2 border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-primary">
              <FaChartLine className="text-2xl" />
              <span className="text-sm font-bold uppercase tracking-[0.2em]">
                {t("workoutDetails")}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-1">
              {workout.trainingPlan.name}
            </h1>
            <p className="text-slate-400 font-medium capitalize">
              {t("dateFormats.weekdayMonthDayYear", {
                date: workout.createdAt,
              })}
            </p>
          </div>
          <CloseModalButton onClose={onClose} />
        </header>

        <div className="flex gap-5">
          <div className="w-full bg-gray-200 dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {t("totalVolume")}
            </p>
            <p className="text-2xl font-black">
              {calculateWorkoutVolume(workout)}{" "}
              <span className="text-sm font-normal opacity-60">kg</span>
            </p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              {t("totalSets")}
            </p>
            <p className="text-2xl font-black">{calculateTotalSets(workout)}</p>
          </div>
        </div>

        <div className="space-y-12">
          {workout.workoutItems.map((workoutItem, workoutItemIndex) => (
            <section key={workoutItemIndex}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      {workoutItem.exercise.name}
                    </h2>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary font-black text-xl leading-none">
                    {workoutItem.sets.reduce(
                      (prev, curr) => prev + curr.reps * curr.weight,
                      0,
                    )}{" "}
                    <span className="text-xs font-medium opacity-70">kg</span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                    {t("exerciseVolume")}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border-light dark:border-border-dark dark:bg-background-dark">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-card-dark text-[10px] uppercase tracking-widest font-bold text-slate-400">
                      <th className="px-4 py-3 border-b border-border-light dark:border-border-dark">
                        {t("set")}
                      </th>
                      <th className="px-4 py-3 border-b border-border-light dark:border-border-dark text-primary text-center">
                        {t("weight")}
                      </th>
                      <th className="px-4 py-3 border-b border-border-light dark:border-border-dark text-primary text-center">
                        {t("reps")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-border-light dark:divide-border-dark/50">
                    {workoutItem.sets.map((set, setIndex) => (
                      <tr
                        className="hover:bg-gray-100 dark:hover:bg-card-dark/30 transition-colors"
                        key={setIndex}
                      >
                        <td className="px-4 py-3 font-bold text-slate-500">
                          {setIndex + 1}
                        </td>
                        <td className="px-4 py-3 font-black text-base text-center">
                          {set.weight} kg
                        </td>
                        <td className="px-4 py-3 font-black text-base text-center">
                          {set.reps}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default WorkoutDetails;
