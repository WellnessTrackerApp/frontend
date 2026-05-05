import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaWeight } from "react-icons/fa";
import AbsoluteWindowWrapper from "../ui/AbsoluteWindowWrapper";
import CancelCreateButtons from "../ui/CancelCreateButtons";
import CloseModalButton from "../ui/CloseModalButton";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateUserMetrics,
  type UpdateUserMetricsRequest,
} from "../../services/gym/userService";
import toast from "react-hot-toast";

interface PhysicalMetricsUpdateModalProps {
  onClose: () => void;
  weight: number | "";
  height: number | "";
}

interface PhysicalMetricsForm {
  height: number | "";
  weight: number | "";
}

const PhysicalMetricsUpdateModal = ({
  onClose,
  weight: currentWeight,
  height: currentHeight,
}: PhysicalMetricsUpdateModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<PhysicalMetricsForm>({
    height: currentHeight,
    weight: currentWeight,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateUserMetricsMutation = useMutation({
    mutationFn: updateUserMetrics,
    onSuccess: () => {
      toast.success(t("toastMessages.userMetricsUpdatedSuccessfully"));
      queryClient.invalidateQueries({
        queryKey: ["userProfile"],
      });
    },
    onError: () => {
      toast.error(t("toastMessages.userMetricsUpdateFailed"));
    },
  });

  const handleMetricsSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    if (formData.height === "" || formData.weight === "") {
      toast.error(t("toastMessages.heightWeightRequired"));
      return;
    }

    if (formData.height < 50 || formData.height > 300) {
      toast.error(t("toastMessages.heightInvalidRange"));
      return;
    }

    if (formData.weight < 40 || formData.weight > 500) {
      toast.error(t("toastMessages.weightInvalidRange"));
      return;
    }

    const updateMetricsRequest: UpdateUserMetricsRequest = {
      height: Number(formData.height),
      weight: Number(formData.weight),
    };

    updateUserMetricsMutation.mutate(updateMetricsRequest);

    onClose();
  };

  return (
    <AbsoluteWindowWrapper isOpen={true} onClose={onClose}>
      <header className="flex-none flex items-center justify-between border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark/95 backdrop-blur-md px-6 py-4 z-20">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <FaWeight className="text-xl" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">
              {t("editPhysicalMetrics")}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("physicalMetricsDescription")}
            </p>
          </div>
        </div>
        <CloseModalButton onClose={onClose} />
      </header>

      <form
        className="w-full h-full flex flex-col justify-between overflow-hidden"
        onSubmit={handleMetricsSubmit}
      >
        <div className="overflow-y-auto scrollbar-none">
          <div className="mx-auto max-w-xl px-6 py-16 flex flex-col gap-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                  {t("heightLabel")} (cm)
                </label>
                <div className="relative group">
                  <input
                    className="w-full bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-gray-400 dark:placeholder-gray-500 [&::-webkit-inner-spin-button]:hidden"
                    name="height"
                    type="number"
                    placeholder="182"
                    value={formData.height}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-bold text-primary uppercase tracking-[0.2em]">
                  {t("weightLabel")} (kg)
                </label>
                <div className="relative group">
                  <input
                    className="w-full bg-white dark:bg-card-dark border border-gray-200 dark:border-border-dark rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-gray-400 dark:placeholder-gray-500 [&::-webkit-inner-spin-button]:hidden"
                    name="weight"
                    step="0.1"
                    type="number"
                    placeholder="84.5"
                    value={formData.weight}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="flex-none border-t border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark p-6 z-30">
          <CancelCreateButtons
            onClose={onClose}
            createButtonTitle={t("saveChanges")}
          />
        </footer>
      </form>
    </AbsoluteWindowWrapper>
  );
};

export default PhysicalMetricsUpdateModal;
