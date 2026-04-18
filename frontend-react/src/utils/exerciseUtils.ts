import type { ExerciseResponse } from "../services/exerciseService";

export const exercisesFilter = (
  data: readonly ExerciseResponse[],
  keyword: string,
) =>
  data.filter((exercise) =>
    exercise.name.toLowerCase().includes(keyword.toLowerCase()),
  );
