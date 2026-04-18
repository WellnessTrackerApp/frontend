const ProfileSectionLoading = () => {
  return (
    <div className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark p-6 overflow-hidden relative animate-skeleton">
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="w-32 h-32 rounded-2xl bg-input-light dark:bg-gray-700 shrink-0" />
        <div className="flex-1 space-y-4 w-full text-center md:text-left">
          <div className="space-y-3">
            <div className="h-9 w-48 bg-input-light dark:bg-gray-600 rounded-md mx-auto md:mx-0" />
            <div className="h-5 w-64 bg-input-light dark:bg-gray-700 rounded-md mx-auto md:mx-0" />
            <div className="h-4 w-40 bg-input-light dark:bg-gray-700 rounded-md mx-auto md:mx-0" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="h-10 w-full lg:w-1/2 bg-input-light dark:bg-border-dark rounded-lg" />
            <div className="h-10 w-full lg:w-1/2 bg-primary/10 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="absolute -right-12 -top-12 size-48 bg-primary/5 rounded-full blur-3xl"></div>
    </div>
  );
};

export default ProfileSectionLoading;
