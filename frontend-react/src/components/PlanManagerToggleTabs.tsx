import clsx from "clsx";
import { useTranslation } from "react-i18next";

interface PlanManagerToggleProps {
  isMyPlansEnabled: boolean;
  isPredefinedPlansEnabled: boolean;
  isMyExercisesEnabled: boolean;
  setIsMyPlansEnabled: (arg: boolean) => void;
  setIsPredefinedPlansEnabled: (arg: boolean) => void;
  setIsMyExercisesEnabled: (arg: boolean) => void;
}

const PlanManagerToggleTabs = ({
  isMyPlansEnabled,
  isPredefinedPlansEnabled,
  isMyExercisesEnabled,
  setIsMyPlansEnabled,
  setIsPredefinedPlansEnabled,
  setIsMyExercisesEnabled,
}: PlanManagerToggleProps) => {
  const { t } = useTranslation();

  const enabledButtonStyle = "border-primary text-primary";
  const disabledButtonStyle =
    "border-transparent text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700";

  const disableAllButtons = () => {
    setIsMyPlansEnabled(false);
    setIsPredefinedPlansEnabled(false);
    setIsMyExercisesEnabled(false);
  };

  return (
    <div className="border-b border-border-light dark:border-border-dark">
      <div className="flex gap-8">
        <button
          className={clsx(
            "flex flex-col items-center justify-center border-b-2 pb-3 px-1 transition-all",
            isMyPlansEnabled ? enabledButtonStyle : disabledButtonStyle,
          )}
          onClick={() => {
            disableAllButtons();
            setIsMyPlansEnabled(true);
          }}
          type="button"
        >
          <span className="text-sm font-medium tracking-wide">
            {t("myPlans")}
          </span>
        </button>

        <button
          className={clsx(
            "flex flex-col items-center justify-center border-b-2 pb-3 px-1 transition-all ",
            isPredefinedPlansEnabled ? enabledButtonStyle : disabledButtonStyle,
          )}
          onClick={() => {
            disableAllButtons();
            setIsPredefinedPlansEnabled(true);
          }}
          type="button"
        >
          <span className="text-sm font-medium tracking-wide">
            {t("predefinedPlans")}
          </span>
        </button>

        <button
          className={clsx(
            "flex flex-col items-center justify-center border-b-2 pb-3 px-1 transition-all",
            isMyExercisesEnabled ? enabledButtonStyle : disabledButtonStyle,
          )}
          onClick={() => {
            disableAllButtons();
            setIsMyExercisesEnabled(true);
          }}
          type="button"
        >
          <span className="text-sm font-medium tracking-wide">
            {t("myExercises")}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PlanManagerToggleTabs;
