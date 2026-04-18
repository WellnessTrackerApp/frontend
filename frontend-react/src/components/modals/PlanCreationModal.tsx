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
  createUserPlan,
  type PlanItemRequest,
  type PlanRequest,
} from "../../services/trainingService";
import type { ErrorResponse, GeneralResponse } from "../../types/ApiResponse";
import PlanItem from "../PlanItem";
import PlanActionModal from "./PlanActionModal";

interface NewPlanProps {
  exercises: Array<ExerciseResponse>;
  onClose: () => void;
}

interface PlanItemForm {
  exerciseId: number;
  exerciseName: string;
  defaultSets: number;
}

interface NewPlanForm {
  planName: string;
  planItems: Array<PlanItemForm>;
}

const PlanCreationModal = ({ exercises, onClose }: NewPlanProps) => {
  const [newPlanForm, setNewPlanForm] = useState<NewPlanForm>({
    planName: "",
    planItems: [],
  });

  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const newPlanMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    PlanRequest
  >({
    mutationFn: createUserPlan,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["userPlans"],
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
    if (newPlanMutation.isPending) return;

    if (!newPlanForm.planName) {
      toast.error(t("toastMessages.planNameRequired"));
      return;
    }

    if (newPlanForm.planItems.length === 0) {
      toast.error(t("toastMessages.planMustHaveAtLeastOneExercise"));
      return;
    }

    const newPlanRequest: PlanRequest = {
      planName: newPlanForm.planName,
      planItems: newPlanForm.planItems.map((planItem) => {
        const planItemRequest: PlanItemRequest = {
          exerciseId: planItem.exerciseId,
          defaultSets: planItem.defaultSets,
        };
        return planItemRequest;
      }),
    };

    newPlanMutation.mutate(newPlanRequest);
  };

  const handleSelectExercise = (selectedExercise: ExerciseResponse) => {
    if (
      newPlanForm.planItems.find(
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

    const updatedPlanForm: NewPlanForm = {
      planName: newPlanForm.planName,
      planItems: [...newPlanForm.planItems, newPlanItem],
    };

    setNewPlanForm(updatedPlanForm);
    toast.success(t("toastMessages.exerciseAddedToPlan"));
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (over && active.id !== over.id) {
      setNewPlanForm((prev) => {
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

  const updateDefaultSets = (exerciseId: number, delta: number) => {
    setNewPlanForm((plan) => ({
      ...plan,
      planItems: plan.planItems.map((planItem) =>
        planItem.exerciseId === exerciseId
          ? {
              ...planItem,
              defaultSets: Math.max(planItem.defaultSets + delta, 1),
            }
          : planItem,
      ),
    }));
  };

  return (
    <PlanActionModal
      exercises={exercises}
      handleSelectExercise={handleSelectExercise}
      title={t("createNewPlan")}
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
              setNewPlanForm((prev) => ({ ...prev, planName: e.target.value }))
            }
          />
        </div>
      }
      saveButtonText={t("create")}
      onClose={onClose}
    >
      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext
          items={newPlanForm.planItems.map((planItem) => planItem.exerciseId)}
          strategy={verticalListSortingStrategy}
        >
          {newPlanForm.planItems.map((planItem) => (
            <PlanItem
              key={planItem.exerciseId}
              id={planItem.exerciseId}
              decrementSetsFunction={() =>
                updateDefaultSets(planItem.exerciseId, -1)
              }
              incrementSetsFunction={() =>
                updateDefaultSets(planItem.exerciseId, 1)
              }
              removePlanItem={() =>
                setNewPlanForm((prev) => ({
                  ...prev,
                  planItems: prev.planItems.filter(
                    (item) => item.exerciseId !== planItem.exerciseId,
                  ),
                }))
              }
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
            />
          ))}
        </SortableContext>
      </DndContext>
    </PlanActionModal>
  );
};

export default PlanCreationModal;
