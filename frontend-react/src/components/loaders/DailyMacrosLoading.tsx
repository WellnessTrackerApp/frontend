const DailyMacrosLoading = () => {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between items-end mb-2">
        <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="flex justify-between mt-5">
        <div className="text-center">
          <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="text-center">
          <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="text-center">
          <div className="h-3 w-8 bg-gray-200 dark:bg-gray-700 rounded mb-1"></div>
          <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default DailyMacrosLoading;
