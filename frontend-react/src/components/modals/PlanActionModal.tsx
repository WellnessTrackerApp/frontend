import { useState } from "react";
import { FaEdit, FaListAlt, FaPlusCircle } from "react-icons/fa";
import type { ExerciseResponse } from "../../services/exerciseService";
import { exercisesFilter } from "../../utils/exerciseUtils";
import ExerciseSelectionOption from "../selections/ExerciseSelectionOption";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";
import CancelCreateButtons from "../ui/CancelCreateButtons";
import CloseModalButton from "../ui/CloseModalButton";
import SelectOptionWindow from "../ui/SelectOptionWindow";
import { useTranslation } from "react-i18next";

interface PlanActionModalProps {
  exercises: Array<ExerciseResponse>;
  handleSelectExercise: (exercise: ExerciseResponse) => void;
  title: string;
  handleSubmit: () => void;
  remainingFormElements: React.ReactNode;
  children: React.ReactNode;
  saveButtonText: string;
  onClose: () => void;
}

const PlanActionModal = ({
  exercises,
  handleSelectExercise,
  title,
  handleSubmit,
  remainingFormElements,
  children: planItems,
  saveButtonText,
  onClose,
}: PlanActionModalProps) => {
  const { t } = useTranslation();

  const [addExerciseEnabled, setAddExerciseEnabled] = useState<boolean>(false);

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <header className="flex-none flex items-center justify-between border-b border-border-light dark:border-border-dark px-6 py-4 z-20">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <FaEdit className="text-lg" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        </div>
        <CloseModalButton onClose={onClose} />
      </header>

      <form
        className="h-full overflow-hidden flex flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex-1 overflow-y-auto scrollbar-none px-4 py-8 md:px-0">
          <div className="mx-auto max-w-2xl px-6 py-12 flex flex-col gap-10">
            {remainingFormElements}

            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-text-main flex items-center gap-2">
                  <FaListAlt className="text-primary text-lg" />
                  {t("planExercises")}
                </h3>
              </div>
              <div className="flex flex-col dark:bg-surface-border/30 rounded-xl overflow-hidden border border-border-light dark:border-border-dark">
                <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-surface-dark/50 text-[10px] font-bold text-text-muted uppercase tracking-widest border-b border-border-light dark:border-border-dark">
                  <div className="col-span-6 md:col-span-8 my-auto">
                    {t("exercise")}
                  </div>
                  <div className="col-span-5 md:col-span-3 text-center my-auto">
                    {t("defaultSets")}
                  </div>
                  <div className="col-span-1"></div>
                </div>
                {planItems}
                <button
                  className="flex w-full items-center justify-center gap-2 dark:bg-surface-dark/40 py-5 text-sm font-semibold text-primary hover:dark:bg-primary/10 transition-all group border-t border-border-light dark:border-border-dark/50"
                  onClick={(e) => {
                    e.preventDefault();
                    setAddExerciseEnabled(true);
                  }}
                >
                  <FaPlusCircle className="text-xl group-hover:scale-110 transition-transform" />
                  {t("addExercise")}
                </button>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex-none border-t border-border-light dark:border-border-dark dark:bg-background-dark p-6 z-30">
          <CancelCreateButtons
            onClose={onClose}
            createButtonTitle={saveButtonText}
          />
        </footer>
      </form>

      {addExerciseEnabled && (
        <SelectOptionWindow
          title={t("selectExercise")}
          onClose={() => setAddExerciseEnabled(false)}
          data={exercises}
          renderItem={(exercise) => (
            <ExerciseSelectionOption exercise={exercise} />
          )}
          onSelect={handleSelectExercise}
          dataFilter={exercisesFilter}
        />
      )}
    </AbsoluteWindowWrapper>
  );
};

export default PlanActionModal;
