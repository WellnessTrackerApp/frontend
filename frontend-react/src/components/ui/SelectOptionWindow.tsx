import { useState } from "react";
import AbsoluteWindowWrapper from "./AbsoluteWindowWrapper";
import CloseModalButton from "./CloseModalButton";
import SearchBar from "./SearchBar";
import { useTranslation } from "react-i18next";

interface SelectOptionWindowProps<T> {
  title: string;
  emptyDataMessage?: string;
  onClose: () => void;
  data: readonly T[];
  dataFilter?: (data: readonly T[], keyword: string) => T[];
  isDataLoading?: boolean;
  onSelect: (item: T) => void;
  renderItem: (data: T) => React.ReactNode;
}

const SelectOptionWindow = <T,>({
  title,
  emptyDataMessage,
  onClose,
  data,
  dataFilter,
  isDataLoading,
  onSelect,
  renderItem,
}: SelectOptionWindowProps<T>) => {
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredData = dataFilter ? dataFilter(data, searchQuery) : data;

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <div className="px-6 pt-6 pb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <CloseModalButton onClose={onClose} />
      </div>
      <div className="px-6 pb-4">
        {dataFilter && (
          <SearchBar setSearchQuery={setSearchQuery} value={searchQuery} />
        )}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-none p-6 pt-2">
        <div className="grid grid-cols-1 gap-3">
          {isDataLoading ? (
            <div className="flex items-center justify-between p-4 bg-selection-light dark:bg-card-dark rounded-xl border border-border-light/20 dark:border-border-dark/30 text-left font-semibold">
              <p>{t("loadingData")}</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex items-center justify-between p-4 bg-selection-light dark:bg-card-dark rounded-xl border border-border-light/20 dark:border-border-dark/30 text-left font-semibold">
              <p>
                {emptyDataMessage ||
                  (dataFilter ? t("noMatchesFound") : t("noOptionsAvailable"))}
              </p>
            </div>
          ) : (
            <>
              {filteredData.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(item)}
                  className="group flex items-center justify-between p-4 bg-selection-light dark:bg-card-dark rounded-xl border border-border-light/20 dark:border-border-dark/30 hover:bg-input-light-hover hover:dark:bg-slate-800/80 transition-all text-left cursor-pointer"
                >
                  {renderItem(item)}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default SelectOptionWindow;
