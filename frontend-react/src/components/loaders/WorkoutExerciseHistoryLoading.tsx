import { Fragment } from "react/jsx-runtime";

const WorkoutExerciseHistoryLoading = () => {
  return (
    <>
      {[1, 2, 3].map((item) => (
        <Fragment key={item}>
          <div className="flex flex-col items-center pt-2 animate-skeleton">
            <div className="flex items-center justify-center w-3 h-3 rounded-full bg-gray-700 mt-5 z-10 ring-4 ring-[#1F2937]"></div>
          </div>

          <div className="flex flex-col py-5 pl-2 border-t border-gray-700/30 flex-1 px-2 -mx-2 animate-skeleton">
            <div className="flex justify-between items-baseline mb-4">
              <div className="space-y-2">
                <div className="h-5 w-28 bg-gray-700 rounded-md"></div>
                <div className="h-3 w-16 bg-gray-800 rounded-md"></div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 animate-skeleton">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-gray-800/80 px-3 py-1.5 rounded-md border border-gray-700 w-24 h-8.5"
                >
                  <div className="flex items-center gap-2 h-full opacity-50">
                    <div className="h-3 w-6 bg-gray-600 rounded"></div>
                    <div className="h-3 w-1 bg-gray-700 rounded"></div>
                    <div className="h-3 w-4 bg-gray-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Fragment>
      ))}
    </>
  );
};

export default WorkoutExerciseHistoryLoading;
