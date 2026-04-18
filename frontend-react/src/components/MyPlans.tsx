import { Link, useNavigate } from "react-router-dom";
import type { PlanResponse } from "../services/trainingService";
import CreateNewResource from "./CreateNewResource";
import PlanBlock from "./PlanBlock";
import PlanBlockLoading from "./loaders/PlanBlockLoading";
import { useTranslation } from "react-i18next";

interface MyPlansProps {
  userPlans: Array<PlanResponse> | undefined;
  plansLoading: boolean;
}

const MyPlans = ({ userPlans, plansLoading }: MyPlansProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="col-span-3 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("myPlans")}
        </h2>
        <Link
          className="text-sm font-medium text-primary hover:text-blue-500"
          to="/plan-manager"
        >
          {t("viewAll")}
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plansLoading || !userPlans ? (
          <PlanBlockLoading />
        ) : (
          userPlans.map((plan) => <PlanBlock key={plan.id} plan={plan} />)
        )}
        <CreateNewResource
          creationText={t("createNewPlan")}
          onNewResourceCreated={() => {
            navigate("/plan-manager");
          }}
        />
      </div>
    </div>
  );
};

export default MyPlans;
