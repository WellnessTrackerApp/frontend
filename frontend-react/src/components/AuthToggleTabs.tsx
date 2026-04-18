import clsx from "clsx";

interface AuthToggleProps {
  isRegister: boolean;
  setIsRegister: (arg: boolean) => void;
}

const AuthToggleTabs = ({ isRegister, setIsRegister }: AuthToggleProps) => {
  return (
    <div className="rounded-t-4xl flex border border-border-light bg-card-light dark:bg-card-dark dark:border-border-dark">
      <button
        type="button"
        className={clsx(
          "rounded-tl-4xl flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-colors",
          isRegister
            ? "border-transparent text-text-muted hover:opacity-80"
            : "text-primary border-primary dark:text-white bg-primary/5 dark:bg-white/5",
        )}
        onClick={() => setIsRegister(false)}
      >
        Login
      </button>
      <button
        type="button"
        className={clsx(
          "rounded-tr-4xl flex-1 py-4 text-center text-sm font-semibold border-b-2 transition-colors",
          isRegister
            ? "text-primary dark:text-white border-primary bg-primary/5 dark:bg-white/5"
            : "border-transparent text-text-muted hover:opacity-80",
        )}
        onClick={() => setIsRegister(true)}
      >
        Register
      </button>
    </div>
  );
};

export default AuthToggleTabs;
