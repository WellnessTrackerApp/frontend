import { FaCheck, FaDumbbell } from "react-icons/fa";
import AbsoluteWindowWrapper from "./AbsoluteWindowWrapper";

interface ConfirmationWindowProps {
  onConfirm: () => void;
  onClose: () => void;
  confirmButtonText: string;
  cancelButtonText: string;
  windowTitle: string;
  windowDescription: string;
}

const ConfirmationWindow = ({
  onConfirm,
  onClose,
  confirmButtonText,
  cancelButtonText,
  windowTitle,
  windowDescription,
}: ConfirmationWindowProps) => {
  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <div className="w-full bg-white dark:bg-[#18181b] rounded-xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <FaDumbbell className="text-5xl text-primary" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1 border-4 border-emerald-500 dark:border-[#18181b]">
              <FaCheck className="text-white text-base block font-bold" />
            </div>
          </div>
          <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl font-bold leading-tight mb-3">
            {windowTitle}
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-base font-normal leading-relaxed mb-8 max-w-[320px]">
            {windowDescription}
          </p>
          <div className="flex flex-col w-full gap-3">
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-center rounded-lg h-14 px-5 bg-primary hover:bg-primary/90 text-white text-base font-bold leading-normal tracking-wide transition-all shadow-lg shadow-primary/20"
              onClick={onConfirm}
            >
              <span className="truncate">{confirmButtonText}</span>
            </button>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-center rounded-lg h-14 px-5 bg-transparent hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 text-base font-semibold leading-normal tracking-wide transition-all border border-slate-200 dark:border-zinc-700"
              onClick={onClose}
            >
              <span className="truncate">{cancelButtonText}</span>
            </button>
          </div>
        </div>
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default ConfirmationWindow;
