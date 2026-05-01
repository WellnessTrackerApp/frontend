import React from "react";

const DailyDietEntriesLoading = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 rounded-lg border border-transparent"
        >
          <div className="flex items-center gap-3">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>

              <div className="h-3 w-16 bg-gray-100 dark:bg-gray-800 rounded"></div>

              <div className="flex gap-2 mt-1">
                <div className="h-4 w-10 bg-blue-100/50 dark:bg-blue-900/20 rounded"></div>
                <div className="h-4 w-10 bg-orange-100/50 dark:bg-orange-900/20 rounded"></div>
                <div className="h-4 w-10 bg-yellow-100/50 dark:bg-yellow-900/20 rounded"></div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="w-4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DailyDietEntriesLoading;
