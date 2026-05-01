import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { parseISO } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  addDietEntry,
  type DietEntryRequest,
} from "../../services/health/dietService";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";
import Button from "../ui/Button";
import CloseModalButton from "../ui/CloseModalButton";

interface MealCreationModalProps {
  onClose: () => void;
}

interface DietEntryForm extends Omit<
  DietEntryRequest,
  "calories" | "protein" | "carbs" | "fat"
> {
  calories: number | "";
  protein: number | "";
  carbs: number | "";
  fat: number | "";
}

const MealCreationModal = ({ onClose }: MealCreationModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [dietEntry, setDietEntry] = useState<DietEntryForm>({
    mealName: "",
    eatenAt: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const addDietEntryMutation = useMutation({
    mutationFn: addDietEntry,
    onSuccess: () => {
      toast.success(t("wellness.mealAddedSuccessfully"));
      queryClient.invalidateQueries({ queryKey: ["dailyDietEntries"] });
      queryClient.invalidateQueries({ queryKey: ["dailyMacros"] });
      setDietEntry({
        mealName: "",
        eatenAt: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      });
    },
    onError: (error: AxiosError) => {
      toast.error(error.message);
    },
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    setDietEntry((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const handleSaveMeal = () => {
    if (addDietEntryMutation.isPending) {
      return;
    }

    if (
      dietEntry.mealName === "" ||
      dietEntry.eatenAt === "" ||
      dietEntry.calories === "" ||
      dietEntry.carbs === "" ||
      dietEntry.fat === "" ||
      dietEntry.protein === ""
    ) {
      toast.error(t("toastMessages.provideAllInformationToAddMeal"));
      return;
    }

    if (
      dietEntry.calories < 0 ||
      dietEntry.carbs < 0 ||
      dietEntry.fat < 0 ||
      dietEntry.protein < 0
    ) {
      toast.error(t("toastMessages.dietEntryDataNegative"));
      return;
    }

    const dietEntryRequest: DietEntryRequest = {
      mealName: dietEntry.mealName.trim(),
      eatenAt: parseISO(dietEntry.eatenAt).toISOString(),
      calories: Number(dietEntry.calories),
      protein: Number(dietEntry.protein),
      carbs: Number(dietEntry.carbs),
      fat: Number(dietEntry.fat),
    };

    addDietEntryMutation.mutate(dietEntryRequest);
  };

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <div className="px-8 py-6 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-100 dark:bg-gray-900/50">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t("wellness.addNewMeal")}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("wellness.logYourNutritionalIntake")}
          </p>
        </div>
        <CloseModalButton onClose={onClose} />
      </div>
      <div className="px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              {t("wellness.mealName")}
            </label>
            <div className="relative group">
              <input
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder={t("wellness.mealName")}
                type="text"
                value={dietEntry.mealName}
                onChange={handleFormChange}
                name="mealName"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-500 dark:text-gray-400 ml-1">
              {t("wellness.dateAndTime")}
            </label>
            <div className="relative group">
              <input
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all [&::-webkit-calendar-picker-indicator]:hidden"
                type="datetime-local"
                onClick={(e) => {
                  e.currentTarget.showPicker();
                }}
                value={dietEntry.eatenAt}
                onChange={handleFormChange}
                name="eatenAt"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            {t("wellness.totalCalories")}
          </label>
          <div className="relative group">
            <input
              className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-3 p-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all [&::-webkit-inner-spin-button]:hidden"
              placeholder="0"
              type="number"
              value={dietEntry.calories}
              onChange={handleFormChange}
              name="calories"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {t("wellness.kcal")}
            </span>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-white/5 pb-2">
            {t("wellness.macronutrients")}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t("wellness.proteinG")}
              </label>
              <input
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 text-gray-900 dark:text-gray-100 [&::-webkit-inner-spin-button]:hidden focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-center"
                placeholder="0"
                type="number"
                value={dietEntry.protein}
                onChange={handleFormChange}
                name="protein"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t("wellness.carbsG")}
              </label>
              <input
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 text-gray-900 dark:text-gray-100 [&::-webkit-inner-spin-button]:hidden focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-center"
                placeholder="0"
                type="number"
                value={dietEntry.carbs}
                onChange={handleFormChange}
                name="carbs"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t("wellness.fatG")}
              </label>
              <input
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-4 text-gray-900 dark:text-gray-100 [&::-webkit-inner-spin-button]:hidden focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all text-center"
                placeholder="0"
                type="number"
                value={dietEntry.fat}
                onChange={handleFormChange}
                name="fat"
              />
            </div>
          </div>
        </div>
        <div className="relative h-24 w-full rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 via-transparent to-teal-500/10"></div>
          <img
            className="w-full h-full object-cover opacity-20 grayscale"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaBzuEhTSC7eW2hLfMuuYaadUbaivEKWJ86JU6ArGdSvc8Xrr3mZNtz2TFHlLIEGea75h2G0RNvtE8wSdLrhm3QYXLnVq1UsFAIC7zjOSYaNCJ40UJMzIdpdzJVoMM4lAHweS8ghTu-urC-HD-NZZWqhAqER2ii5GahOAMwuuvscT--4_s203GLZTRqnKKVY_7_xQ-LGHGcp0TB3OTM45n9JIv35IMNCESZ372FN_IsMdG7DdQBZhFqtO1jUzoFSOzFiGuRlDmHFPr"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
              {t("wellness.precisionNutritionTracking")}
            </p>
          </div>
        </div>
      </div>
      <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900/80 border-t border-gray-200 dark:border-white/10 flex items-center justify-end gap-4">
        <Button
          btnStyle={"cancel"}
          size={"big"}
          children={t("cancel")}
          additionalStyle="px-6 py-2.5 rounded-lg"
          onClick={onClose}
        />
        <Button
          btnStyle={"approve"}
          size={"big"}
          children={t("wellness.saveMeal")}
          additionalStyle="px-8 py-2.5 text-white! rounded-lg font-bold"
          onClick={handleSaveMeal}
        />
      </div>
    </AbsoluteWindowWrapper>
  );
};

export default MealCreationModal;
