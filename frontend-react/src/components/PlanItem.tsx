import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaDumbbell, FaGripHorizontal, FaTrashAlt } from "react-icons/fa";

interface PlanItemProps {
  exerciseName: string;
  exerciseCategory: string;
  defaultSets: number;
  decrementSetsFunction: () => void;
  incrementSetsFunction: () => void;
  removePlanItem: () => void;
  id: number;
}

const PlanItem = ({
  exerciseName,
  exerciseCategory,
  defaultSets,
  decrementSetsFunction,
  incrementSetsFunction,
  removePlanItem,
  id,
}: PlanItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-12 gap-4 px-5 py-4 items-center transition-colors"
    >
      <div className="group col-span-6 md:col-span-8 flex items-center gap-4">
        <div className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-input-light dark:bg-background-dark border border-border-light/50 dark:border-border-dark text-primary">
          <FaDumbbell className="md:block text-xl rotate-45 group-hover:hidden" />
          <button
            type="button"
            className="hidden justify-center items-center group-hover:flex rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all cursor-pointer w-full h-full"
            onClick={removePlanItem}
          >
            <FaTrashAlt className="text-sm md:text-lg" />
          </button>
        </div>
        <button
          type="button"
          className="block md:hidden justify-center items-center rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-all cursor-pointer"
          onClick={removePlanItem}
        >
          <FaTrashAlt className="-ml-2" size={18} />
        </button>
        <div className="min-w-0">
          <p className="text-xs md:text-md font-semibold truncate">
            {exerciseName}
          </p>
          <p className="text-xs text-text-muted mt-0.5 capitalize">
            {exerciseCategory}
          </p>
        </div>
      </div>
      <div className="col-span-5 md:col-span-3 flex justify-center">
        <div className="flex items-center bg-input-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark overflow-hidden">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center hover:bg-border-light dark:hover:bg-border-dark transition-colors text-text-muted"
            onClick={(e) => {
              e.preventDefault();
              decrementSetsFunction();
            }}
          >
            -
          </button>
          <span className="flex justify-center items-center w-10 h-8 text-center text-xs md:text-sm font-medium">
            {defaultSets}
          </span>

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center hover:bg-border-light dark:hover:bg-border-dark transition-colors text-text-muted"
            onClick={(e) => {
              e.preventDefault();
              incrementSetsFunction();
            }}
          >
            +
          </button>
        </div>
      </div>
      <div className="col-span-1 flex justify-end">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 text-gray-400 hover:text-gray-600 touch-none -mr-4 sm:mr-0"
        >
          <FaGripHorizontal size={20} />
        </div>
      </div>
    </div>
  );
};

export default PlanItem;
