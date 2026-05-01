const NotificationLoading = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4 p-4 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-gray-700 shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-20 bg-gray-700 rounded"></div>
          <div className="h-4 w-full bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="flex gap-4 p-4 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-gray-700 shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-24 bg-gray-700 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="flex gap-4 p-4 animate-pulse">
        <div className="w-10 h-10 rounded-xl bg-gray-700 shrink-0"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 w-16 bg-gray-700 rounded"></div>
          <div className="h-4 w-full bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default NotificationLoading;
