import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  value: string;
  setSearchQuery: (value: string) => void;
}

const SearchBar = ({ value, setSearchQuery }: SearchBarProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500 group-focus-within:text-gray-600 group-focus-within:dark:text-primary transition-colors">
        <FaSearch className="text-xl" size={16} />
      </div>
      <input
        type="text"
        aria-label="Search"
        className="w-full bg-selection-light dark:bg-slate-800/50 border border-border-light/50 dark:border-slate-700/50 rounded-xl py-3 pl-11 pr-4 text-sm focus:ring-1 focus:ring-border-light focus:dark:ring-primary/50 focus:dark:border-primary/50 outline-none transition-all placeholder:text-slate-500"
        placeholder={t("search")}
        onChange={(e) => setSearchQuery(e.target.value)}
        value={value}
      />
    </div>
  );
};

export default SearchBar;
