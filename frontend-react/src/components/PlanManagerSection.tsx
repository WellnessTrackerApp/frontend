import { FaPlus } from "react-icons/fa";

interface PlanManagerSectionProps {
  isVisible: boolean;
  onClick: (...args: unknown[]) => void;
  isButton: boolean;
  buttonText?: string;
}

const PlanManagerSection = ({
  isVisible,
  onClick,
  isButton,
  buttonText,
}: PlanManagerSectionProps) => {
  if (!isVisible) return;

  return (
    <div>
      {isButton && (
        <button
          className="bg-blue-500 px-3 rounded-xl flex justify-center items-center cursor-pointer hover:bg-blue-400 transition-colors"
          onClick={onClick}
        >
          <FaPlus className="mr-2" />
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default PlanManagerSection;
