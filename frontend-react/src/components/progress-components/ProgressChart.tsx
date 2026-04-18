import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface DataContent {
  date: string;
  value: number;
}

interface ProgressChartProps {
  historyData: Array<DataContent>;
  yAxisTitle?: string;
}

const ProgressChart = ({ historyData, yAxisTitle }: ProgressChartProps) => {
  const { t } = useTranslation();

  const processedData = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];

    const bestEntries = historyData.reduce(
      (acc, curr) => {
        const existingValue = acc[curr.date]?.value ?? -Infinity;

        if (curr.value > existingValue) {
          acc[curr.date] = { ...curr };
        }

        return acc;
      },
      {} as Record<string, DataContent>,
    );

    return Object.values(bestEntries).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [historyData]);

  if (processedData.length === 0) {
    return (
      <div className="flex flex-col text-xl justify-center text-gray-400 dark:text-gray-500 h-full text-center ">
        <Trans i18nKey="noProgressChartData" />
      </div>
    );
  }

  return (
    <div className="h-64 min-h-48 outline-none focus:outline-none mt-3 [&_.recharts-surface]:outline-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={processedData}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-border-light dark:stroke-border-dark"
          />

          <XAxis dataKey="date" stroke="#ccc" fontSize={12} />

          <YAxis
            stroke="#ccc"
            fontSize={12}
            label={{
              value: yAxisTitle || "",
              angle: -90,
              textAnchor: "middle",
              position: "insideLeft",
            }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#333",
              color: "white",
              border: "none",
            }}
            cursor={false}
          />

          <Bar
            dataKey="value"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            name={t("volume")}
            maxBarSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
