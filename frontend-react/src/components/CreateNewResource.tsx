import { FaPlus } from "react-icons/fa";

interface CreateNewResourceProps {
  creationText: string;
  descriptionText?: string;
  onNewResourceCreated: () => void;
}

const CreateNewResource = ({
  creationText,
  descriptionText,
  onNewResourceCreated,
}: CreateNewResourceProps) => {
  return (
    <button
      className="group relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-transparent p-5 text-center transition-colors hover:border-primary hover:bg-primary/5 dark:hover:border-primary dark:hover:bg-primary/5 cursor-pointer min-h-35"
      onClick={onNewResourceCreated}
      type="button"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:text-primary transition-colors">
        <FaPlus />
      </div>
      <span className="text-sm font-medium text-gray-500 group-hover:text-primary dark:text-gray-400 transition-colors">
        {creationText}
      </span>
      {descriptionText && (
        <span className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-primary leading-tight transition-colors">
          {descriptionText}
        </span>
      )}
    </button>
  );
};

export default CreateNewResource;
