import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaInfoCircle } from "react-icons/fa";
import {
  createNewExercise,
  EXERCISE_CATEGORIES,
  type ExerciseCategory,
  type ExerciseCreationRequest,
  type ExerciseResponse,
} from "../../services/exerciseService";
import type { ErrorResponse } from "../../types/ApiResponse";
import CategorySelectionOption from "../selections/CategorySelectionOption";
import SelectOptionWindow from "../ui/SelectOptionWindow";
import ExerciseActionModal from "./ExerciseActionModal";

interface CreateNewExerciseProps {
  onClose: () => void;
}

interface NewExerciseForm {
  exerciseName: string;
  category: ExerciseCategory;
}

const CreateNewExerciseForm = ({ onClose }: CreateNewExerciseProps) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [formData, setFormData] = useState<NewExerciseForm>({
    exerciseName: "",
    category: "UNCATEGORIZED",
  });

  const [categorySelection, setCategorySelection] = useState<boolean>(false);

  const newExerciseMutation = useMutation<
    ExerciseResponse,
    AxiosError<ErrorResponse>,
    ExerciseCreationRequest
  >({
    mutationFn: createNewExercise,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["userExercises"] });
      toast.success(
        t("toastMessages.exerciseCreatedSuccessfully", {
          name: response.name,
        }),
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
    if (newExerciseMutation.isPending) return;

    if (!formData.exerciseName.trim()) {
      toast.error(t("toastMessages.exerciseNameRequired"));
      return;
    }

    const newExerciseRequest: ExerciseCreationRequest = {
      name: formData.exerciseName,
      category: formData.category || "UNCATEGORIZED",
    };

    newExerciseMutation.mutate(newExerciseRequest);
  };

  return (
    <ExerciseActionModal
      title={t("createExercise")}
      onClose={onClose}
      handleFormSubmit={handleFormSubmit}
      submitButtonTitle={t("create")}
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
        <div className="flex items-center gap-3 p-4 rounded-xl bg-card-light/50 dark:bg-card-dark border border-border-light/50 dark:border-border-dark/50">
          <FaInfoCircle className="text-primary/60" size={25} />
          <p className="text-xs text-gray-500 dark:text-text-muted leading-relaxed">
            {t("createExerciseModalDescription")}
          </p>
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

export default CreateNewExerciseForm;
