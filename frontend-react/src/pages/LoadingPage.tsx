import { FaDumbbell } from "react-icons/fa";

interface LoadingPageProps {
  title: string;
  description: string;
}

const LoadingPage = ({ title, description }: LoadingPageProps) => {
  return (
    <div className="relative min-h-screen bg-background-light dark:bg-background-dark font-display text-black dark:text-white antialiased overflow-hidden">
      <div className="absolute inset-0 bg-light-grid-pattern dark:bg-dark-grid-pattern bg-size-[40px_40px] pointer-events-none opacity-60"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-transparent to-background-light dark:to-background-dark pointer-events-none"></div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-light/80 dark:bg-background-dark/80">
        <div className="max-w-md w-full p-8 flex flex-col items-center text-center space-y-8">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-action-blue/20 pulse-effect"></div>
            <div className="relative size-24">
              <svg
                className="w-full h-full animate-spin-slow"
                viewBox="0 0 100 100"
              >
                <circle
                  className="text-gray-800"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <circle
                  className="text-action-blue"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="42"
                  stroke="currentColor"
                  strokeDasharray="263.89"
                  strokeDashoffset="190"
                  strokeLinecap="round"
                  strokeWidth="4"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaDumbbell className="text-action-blue text-3xl font-light" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-gray-600 dark:text-gray-400 text-base max-w-70 mx-auto leading-relaxed">
              {description}
            </p>
          </div>
          <div className="w-64 h-1 bg-gray-300 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-action-blue w-1/3 rounded-full animate-[progress_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
