import { FaEdit } from "react-icons/fa";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";
import CancelCreateButtons from "../ui/CancelCreateButtons";
import CloseModalButton from "../ui/CloseModalButton";

interface CreateNewExerciseProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  submitButtonTitle: string;
}

const ExerciseActionModal = ({
  title,
  children,
  onClose,
  handleFormSubmit,
  submitButtonTitle,
}: CreateNewExerciseProps) => {
  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <header className="flex-none flex items-center justify-between border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark/95 backdrop-blur-md px-6 py-4 z-20">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <FaEdit className="text-xl" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        </div>
        <CloseModalButton onClose={onClose} />
      </header>

      <form
        className="w-full h-full flex flex-col justify-between overflow-hidden"
        onSubmit={handleFormSubmit}
      >
        <div className="overflow-y-auto scrollbar-none">{children}</div>
        <footer className="flex-none border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-6 z-30">
          <CancelCreateButtons
            onClose={onClose}
            createButtonTitle={submitButtonTitle}
          />
        </footer>
      </form>
    </AbsoluteWindowWrapper>
  );
};

export default ExerciseActionModal;
