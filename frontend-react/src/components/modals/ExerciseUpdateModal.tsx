import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaChevronDown } from "react-icons/fa";
import {
  EXERCISE_CATEGORIES,
  updateExercise,
  type ExerciseResponse,
  type UpdateExerciseProps,
} from "../../services/exerciseService";
import type { ErrorResponse } from "../../types/ApiResponse";
import SelectOptionWindow from "../ui/SelectOptionWindow";
import ExerciseActionModal from "./ExerciseActionModal";
import CategorySelectionOption from "../selections/CategorySelectionOption";
import { useTranslation } from "react-i18next";

interface ExerciseUpdateProps {
  onClose: () => void;
  exercise: ExerciseResponse;
}

interface ExerciseUpdateForm {
  exerciseName: string;
  category: string;
}

const ExerciseUpdateModal = ({ onClose, exercise }: ExerciseUpdateProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<ExerciseUpdateForm>({
    exerciseName: exercise.name,
    category: exercise.category,
  });

  const [categorySelection, setCategorySelection] = useState<boolean>(false);

  const exerciseUpdateMutation = useMutation<
    ExerciseResponse,
    AxiosError<ErrorResponse>,
    UpdateExerciseProps
  >({
    mutationFn: updateExercise,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["userExercises"] });
      toast.success(
        t("toastMessages.exerciseUpdatedSuccessfully", { name: response.name }),
      );
      onClose();
    },
    onError: (error) => {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    },
  });

  const handleFormUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exerciseUpdateMutation.isPending) return;

    if (!formData.exerciseName.trim()) {
      toast.error(t("toastMessages.exerciseNameRequired"));
      return;
    }

    const exerciseUpdateRequest: UpdateExerciseProps = {
      exerciseId: exercise.exerciseId,
      request: {
        name: formData.exerciseName,
        category: formData.category || "UNCATEGORIZED",
      },
    };

    exerciseUpdateMutation.mutate(exerciseUpdateRequest);
  };

  return (
    <ExerciseActionModal
      title={t("updateExercise")}
      onClose={onClose}
      handleFormSubmit={handleFormSubmit}
      submitButtonTitle={t("update")}
    >
      <div className="mx-auto max-w-xl px-6 py-16 flex flex-col gap-12">
        <div className="group relative">
          <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3">
            {t("exerciseName")}
          </label>
          <input
            className="w-full bg-transparent text-3xl md:text-4xl font-bold placeholder-text-muted/20 border-0 border-b-2 border-border-light dark:border-border-dark focus:border-primary focus:outline-none focus:ring-0 px-0 pb-4 transition-colors"
            name="exerciseName"
            placeholder={t("exerciseNamePlaceholder")}
            type="text"
            onChange={handleFormUpdate}
            value={formData["exerciseName"]}
            required
          />
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">
              {t("exerciseCategory")}
            </label>
            <button
              type="button"
              className="w-full flex justify-between items-center bg-card-light/50 dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3 focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setCategorySelection(true);
              }}
            >
              <span className="capitalize">
                {formData["category"] === "UNCATEGORIZED"
                  ? t("selectCategory")
                  : t(
                      `exerciseCategories.${formData["category"].toLowerCase()}`,
                    ).toLowerCase()}
              </span>
              <FaChevronDown />
            </button>
          </div>
        </div>
      </div>

      {categorySelection && (
        <SelectOptionWindow
          title={t("selectCategory")}
          onClose={() => setCategorySelection(false)}
          data={EXERCISE_CATEGORIES}
          onSelect={(item) => {
            setFormData((prev) => ({
              ...prev,
              category: item,
            }));
            setCategorySelection(false);
          }}
          renderItem={(category) => (
            <CategorySelectionOption
              exerciseCategory={t(
                `exerciseCategories.${category.toLowerCase()}`,
              )}
            />
          )}
          dataFilter={(data, keyword) =>
            data.filter((exerciseCategory) =>
              t(`exerciseCategories.${exerciseCategory.toLowerCase()}`)
                .toLowerCase()
                .includes(keyword.toLowerCase()),
            )
          }
        />
      )}
    </ExerciseActionModal>
  );
};

export default ExerciseUpdateModal;
