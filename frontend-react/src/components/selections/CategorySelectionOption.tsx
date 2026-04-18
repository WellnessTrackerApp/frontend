import { FaChevronRight } from "react-icons/fa";

interface CategorySelectionOptionProps {
  exerciseCategory: string;
}

const CategorySelectionOption = ({
  exerciseCategory,
}: CategorySelectionOptionProps) => {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <p className="font-bold group-hover:text-primary transition-colors capitalize">
            {exerciseCategory.toLowerCase()}
          </p>
        </div>
      </div>
      <FaChevronRight className="text-slate-600 group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
  );
};

export default CategorySelectionOption;
