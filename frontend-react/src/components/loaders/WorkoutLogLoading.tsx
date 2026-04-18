const WorkoutLogLoading = () => {
  return (
    <tr className="animate-skeleton">
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
        <div className="h-5 w-full bg-input-light dark:bg-gray-700 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-5 w-full bg-input-light dark:bg-gray-700 rounded"></div>
      </td>
      <td className="px-6 py-4">
        <div className="h-5 w-full bg-input-light dark:bg-gray-700 rounded"></div>
      </td>
      <td className="hidden px-6 py-4 text-center sm:block">
        <div className="inline-flex justify-center h-6 w-7/8 rounded bg-input-light dark:bg-gray-700"></div>
      </td>
    </tr>
  );
};

export default WorkoutLogLoading;
