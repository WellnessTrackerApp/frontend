import { FaTimes } from "react-icons/fa";

interface CloseModalButtonProps {
  onClose: () => void;
}

const CloseModalButton = ({ onClose }: CloseModalButtonProps) => {
  return (
    <button
      className="group flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200 hover:dark:bg-surface-border text-text-muted hover:text-gray-500 hover:dark:text-white transition-colors"
      onClick={onClose}
      aria-label="Close"
    >
      <FaTimes size={18} />
    </button>
  );
};

export default CloseModalButton;
