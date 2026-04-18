import type {
  WorkoutExerciseHistoryResponse,
  WorkoutResponse,
  WorkoutSessionSnapshot,
  WorkoutTrainingHistoryResponse,
} from "../services/workoutService";

export const calculateWorkoutVolume = (workout: WorkoutResponse) => {
  if (!workout.workoutItems) return 0;

  return workout.workoutItems.reduce(
    (prev, curr) =>
      prev +
      curr.sets.reduce((prev, curr) => prev + curr.reps * curr.weight, 0),
    0
  );
};

export const calculateTotalSets = (workout: WorkoutResponse) => {
  if (!workout.workoutItems) return 0;

  return workout.workoutItems.reduce(
    (prev, curr) => prev + curr.sets.length,
    0
  );
};

export const findMaxVolume = (
  workoutTrainingHistory: WorkoutTrainingHistoryResponse
) => {
  let maxVolume = 0;

  workoutTrainingHistory.history.forEach((workout: WorkoutSessionSnapshot) => {
    const workoutVolume = workout.sets.reduce(
      (prev, curr) => prev + curr.reps * curr.weight,
      0
    );
    if (workoutVolume > maxVolume) {
      maxVolume = workoutVolume;
    }
  });

  return maxVolume;
};

export const findMaxLift = (
  workoutExerciseHistory: WorkoutExerciseHistoryResponse
) => {
  let maxLift = 0;

  workoutExerciseHistory.history.forEach((session: WorkoutSessionSnapshot) => {
    session.sets.forEach((set) => {
      const lift = set.weight;
      if (lift > maxLift) {
        maxLift = lift;
      }
    });
  });

  return maxLift;
};
