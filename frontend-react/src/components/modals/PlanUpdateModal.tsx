import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { ExerciseResponse } from "../../services/exerciseService";
import {
  updateTrainingPlan,
  type PlanResponse,
  type UpdateTrainingPlanProps,
} from "../../services/trainingService";
import type { ErrorResponse, GeneralResponse } from "../../types/ApiResponse";
import PlanItem from "../PlanItem";
import PlanActionModal from "./PlanActionModal";

interface UpdatePlanProps {
  exercises: Array<ExerciseResponse>;
  plan: PlanResponse;
  onClose: () => void;
}

interface PlanItemForm {
  exerciseId: number;
  exerciseName: string;
  defaultSets: number;
}

interface UpdatePlanForm {
  planName: string;
  planItems: Array<PlanItemForm>;
}

const PlanUpdateModal = ({ exercises, plan, onClose }: UpdatePlanProps) => {
  const [planForm, setPlanForm] = useState<UpdatePlanForm>({
    planName: plan.name,
    planItems: [...plan.planItems],
  });

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const updatePlanMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    UpdateTrainingPlanProps
  >({
    mutationFn: updateTrainingPlan,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["userPlans"],
      });
      queryClient.invalidateQueries({
        queryKey: ["trainingPlan", plan.id],
      });
      toast.success(response.message);
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

  const handleSubmit = () => {
    if (updatePlanMutation.isPending) return;

    if (!planForm.planName) {
      toast.error(t("toastMessages.planNameRequired"));
      return;
    }

    if (planForm.planItems.length === 0) {
      toast.error(t("toastMessages.planMustHaveAtLeastOneExercise"));
      return;
    }

    const updatePlanRequest: UpdateTrainingPlanProps = {
      trainingPlanId: plan.id,
      trainingPlanUpdateRequest: {
        planName: planForm.planName,
        planItems: planForm.planItems.map((planItem) => ({
          exerciseId: planItem.exerciseId,
          defaultSets: planItem.defaultSets,
        })),
      },
    };

    updatePlanMutation.mutate(updatePlanRequest);
  };

  const handleSelectExercise = (selectedExercise: ExerciseResponse) => {
    if (
      planForm.planItems.find(
        (element) => element.exerciseId === selectedExercise.exerciseId,
      )
    ) {
      toast.error(t("toastMessages.exerciseAlreadyAdded"));
      return;
    }

    const newPlanItem: PlanItemForm = {
      exerciseId: selectedExercise.exerciseId,
      exerciseName: selectedExercise.name,
      defaultSets: 1,
    };

    const updatedPlanForm: UpdatePlanForm = {
      planName: planForm.planName,
      planItems: [...planForm.planItems, newPlanItem],
    };

    setPlanForm(updatedPlanForm);
    toast.success(t("toastMessages.exerciseAddedToPlan"));
  };

  const updateDefaultSets = (exerciseId: number, delta: number) => {
    setPlanForm((prev) => ({
      ...prev,
      planItems: prev.planItems.map((planItem) =>
        planItem.exerciseId === exerciseId
          ? {
              ...planItem,
              defaultSets: Math.max(planItem.defaultSets + delta, 1),
            }
          : planItem,
      ),
    }));
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (over && active.id !== over.id) {
      setPlanForm((prev) => {
        const oldIndex = prev.planItems.findIndex(
          (planItem) => planItem.exerciseId === active.id,
        );
        const newIndex = prev.planItems.findIndex(
          (planItem) => planItem.exerciseId === over.id,
        );

        return {
          ...prev,
          planItems: arrayMove(prev.planItems, oldIndex, newIndex),
        };
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <PlanActionModal
      exercises={exercises}
      handleSelectExercise={handleSelectExercise}
      title={t("updatePlan")}
      handleSubmit={handleSubmit}
      remainingFormElements={
        <div className="group relative">
          <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3">
            {t("planName")}
          </label>
          <input
            className="w-full bg-transparent text-3xl md:text-4xl font-bold placeholder-text-muted/30 border-0 border-b-2 border-border-light dark:border-border-dark focus:border-primary focus:outline-none focus:ring-0 px-0 pb-4 transition-colors"
            placeholder={t("planNamePlaceholder")}
            type="text"
            required
            onChange={(e) =>
              setPlanForm((prev) => ({ ...prev, planName: e.target.value }))
            }
            value={planForm["planName"]}
          />
        </div>
      }
      saveButtonText={t("update")}
      onClose={onClose}
    >
      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={planForm.planItems.map((planItem) => planItem.exerciseId)}
          strategy={verticalListSortingStrategy}
        >
          {planForm.planItems.map((planItem) => (
            <PlanItem
              key={planItem.exerciseId}
              id={planItem.exerciseId}
              exerciseName={planItem.exerciseName}
              exerciseCategory={t(
                `exerciseCategories.${
                  exercises
                    .find(
                      (exercise) => exercise.exerciseId === planItem.exerciseId,
                    )
                    ?.category?.toLowerCase() ?? "uncategorized"
                }`,
              ).toLowerCase()}
              defaultSets={planItem.defaultSets}
              decrementSetsFunction={() =>
                updateDefaultSets(planItem.exerciseId, -1)
              }
              incrementSetsFunction={() =>
                updateDefaultSets(planItem.exerciseId, 1)
              }
              removePlanItem={() => {
                setPlanForm((prev) => ({
                  ...prev,
                  planItems: prev.planItems.filter(
                    (item) => item.exerciseId !== planItem.exerciseId,
                  ),
                }));
              }}
            />
          ))}
        </SortableContext>
      </DndContext>
    </PlanActionModal>
  );
};

export default PlanUpdateModal;
