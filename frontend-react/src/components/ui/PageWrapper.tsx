import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { useUserProfile } from "../../hooks/useUserProfile";
import Sidebar from "../Sidebar";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = ({ children }: PageWrapperProps) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { data: currentUser } = useUserProfile();

  return (
    <div
      className="flex h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased"
      onClick={() => setSidebarVisible(false)}
    >
      <header className="flex h-16 shrink-0 md:hidden items-center justify-start px-6 py-4 border-b border-border-dark bg-card-dark">
        <button
          className="p-2 text-gray-400 hover:text-white cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setSidebarVisible(!sidebarVisible);
          }}
        >
          <FaBars size={20} />
        </button>
      </header>
      <div className="relative flex flex-1 overflow-hidden">
        <Sidebar username={currentUser?.username} isOpen={sidebarVisible} />
        <main
          className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark scrollbar-none"
          onClick={() => setSidebarVisible(false)}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageWrapper;
