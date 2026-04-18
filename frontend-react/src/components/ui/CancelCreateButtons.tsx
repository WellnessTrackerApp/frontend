import { useTranslation } from "react-i18next";
import { FaPlus } from "react-icons/fa";

interface CancelCreateButtonsProps {
  onClose: () => void;
  createButtonTitle: string;
}

const CancelCreateButtons = ({
  onClose,
  createButtonTitle,
}: CancelCreateButtonsProps) => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-xl flex items-center justify-between">
      <button
        className="px-6 py-2 text-sm font-medium text-text-muted hover:text-gray-500 hover:dark:text-white transition-colors cursor-pointer"
        type="button"
        onClick={onClose}
      >
        {t("cancel")}
      </button>
      <button
        className="flex items-center gap-2 rounded-xl bg-primary px-10 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:scale-105 transition-all active:translate-y-0 active:scale-95 cursor-pointer"
        type="submit"
      >
        <FaPlus />
        {createButtonTitle}
      </button>
    </div>
  );
};

export default CancelCreateButtons;
