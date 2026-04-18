interface LoadingFailedProps {
  message: string;
}

const LoadingFailed = ({ message }: LoadingFailedProps) => {
  return (
    <p className="text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-2 rounded-xl col-span-full text-start">
      {message}
    </p>
  );
};

export default LoadingFailed;
