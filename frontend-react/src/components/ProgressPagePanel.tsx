import { FaChevronDown } from "react-icons/fa";
import Button from "./ui/Button";
import SelectOptionWindow from "./ui/SelectOptionWindow";

interface ProgressPagePanelProps<T> {
  isVisible: boolean;
  title: string;
  buttonText: string;
  setActiveWindow: () => void;
  disableActiveWindow: () => void;
  isActiveWindow: boolean;
  windowTitle: string;
  windowData: T[];
  windowDataFilterFunction?: (data: readonly T[], keyword: string) => T[];
  isWindowDataLoading: boolean;
  onSelectData: (data: T) => void;
  renderWindowItem: (data: T) => React.ReactNode;
}

const ProgressPagePanel = <T,>({
  isVisible,
  title,
  buttonText,
  setActiveWindow,
  disableActiveWindow,
  isActiveWindow,
  windowTitle,
  windowData,
  windowDataFilterFunction,
  isWindowDataLoading,
  onSelectData,
  renderWindowItem,
}: ProgressPagePanelProps<T>) => {
  if (!isVisible) return null;

  return (
    <div className="my-5">
      <p className="text-gray-400 mb-1.5">{title}</p>
      <Button
        btnStyle="options"
        size="medium"
        onClick={setActiveWindow}
        additionalStyle="rounded-md"
      >
        <span>{buttonText}</span>
        <FaChevronDown />
      </Button>
      {isActiveWindow && (
        <SelectOptionWindow
          title={windowTitle}
          onClose={disableActiveWindow}
          data={windowData}
          isDataLoading={isWindowDataLoading}
          onSelect={onSelectData}
          renderItem={renderWindowItem}
          dataFilter={windowDataFilterFunction}
        />
      )}
    </div>
  );
};

export default ProgressPagePanel;
