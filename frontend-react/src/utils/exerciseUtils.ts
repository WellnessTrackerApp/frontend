import type { ExerciseResponse } from "../services/gym/exerciseService";

export const exercisesFilter = (
  data: readonly ExerciseResponse[],
  keyword: string,
) =>
  data.filter((exercise) =>
    exercise.name.toLowerCase().includes(keyword.toLowerCase()),
  );
