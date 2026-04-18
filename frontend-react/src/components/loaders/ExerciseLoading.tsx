const ExerciseLoading = () => {
  return (
    <div className="flex flex-col bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden animate-skeleton">
      <div className="p-5 flex flex-col justify-between gap-4 flex-1">
        <div className="flex justify-between items-start">
          <div className="flex items-center justify-between w-full">
            <div className="h-6 w-3/5 bg-input-light dark:bg-gray-700 rounded-md mb-1"></div>
            <div className="flex gap-1">
              <div className="h-7 w-7 rounded-lg bg-input-light dark:bg-gray-700 border border-border-light dark:border-border-dark"></div>
              <div className="h-7 w-7 rounded-lg bg-input-light dark:bg-gray-700 border border-border-light dark:border-border-dark"></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded bg-input-light dark:bg-gray-700"></div>
            <div className="h-3 w-20 bg-input-light dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseLoading;
