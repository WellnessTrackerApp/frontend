const PlanLoading = () => {
  return (
    <div className="flex flex-col bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark overflow-hidden shadow-lg animate-skeleton">
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex">
          <div className="h-6 w-30 bg-input-light dark:bg-gray-700 mb-1"></div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5 h-5 w-20 bg-input-light dark:bg-gray-700"></div>
          <div className="flex items-center gap-1.5 h-5 w-20 bg-input-light dark:bg-gray-700"></div>
        </div>
        <div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark flex gap-3">
          <div className="flex-1 flex h-9 rounded-lg bg-input-light dark:bg-gray-700"></div>
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-input-light dark:bg-gray-700 "></div>
        </div>
      </div>
    </div>
  );
};

export default PlanLoading;
