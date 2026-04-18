import { FaHeartBroken, FaMapMarkedAlt, FaThLarge } from "react-icons/fa";
import { Link } from "react-router-dom";
import PageWrapper from "../components/ui/PageWrapper";

function ErrorPage() {
  return (
    <PageWrapper>
      <div className="flex-1 flex w-full h-screen items-center justify-center p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative inline-block">
            <div className="text-9xl font-black text-gray-100 dark:text-white/5 absolute -top-12 left-1/2 -translate-x-1/2 z-0">
              404
            </div>
            <div className="relative z-10 p-12 bg-white/5 backdrop-blur-sm rounded-full border border-gray-200 dark:border-border-dark inline-flex items-center justify-center shadow-2xl">
              <FaMapMarkedAlt className="text-8xl text-primary" />
              <div className="absolute -bottom-2 -right-2 bg-red-500 text-white rounded-full p-2 border-4 border-background-light dark:border-background-dark">
                <FaHeartBroken className="text-2xl" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
              Looks like you took a
              <span className="text-primary"> wrong turn</span> at the squat
              rack.
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
              The page you are looking for doesn't exist or has been moved to
              another station.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              className="w-full sm:w-auto bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 active:scale-95"
              to="/"
            >
              <FaThLarge />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

export default ErrorPage;
