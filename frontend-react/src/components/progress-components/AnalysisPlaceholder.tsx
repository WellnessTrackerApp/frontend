import { useTranslation } from "react-i18next";
import { FaChartLine, FaPlus } from "react-icons/fa";

interface AnalysisPlaceholderProps {
  type: string | null;
}

const AnalysisPlaceholder = ({ type }: AnalysisPlaceholderProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
        <div className="relative w-24 h-24 rounded-3xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-border-dark flex items-center justify-center">
          <FaChartLine size={48} className="text-gray-400 dark:text-gray-500" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-primary border-primary flex items-center justify-center text-white shadow-lg border-4">
          <FaPlus size={20} />
        </div>
      </div>
      <div className="max-w-md space-y-3">
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t("startYourAnalysis")}
        </h4>
        <p className="text-gray-500 dark:text-gray-400">
          {type === "exercise" ? t("chooseExercise") : t("choosePlan")}
        </p>
      </div>
    </div>
  );
};

export default AnalysisPlaceholder;
