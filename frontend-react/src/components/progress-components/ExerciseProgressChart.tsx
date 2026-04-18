import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ExerciseProgressData {
  date: string;
  volume: number;
  maxWeight: number;
}

interface ExerciseProgressChartProps {
  historyData: Array<ExerciseProgressData>;
}

const ExerciseProgressChart = ({ historyData }: ExerciseProgressChartProps) => {
  const { t } = useTranslation();

  const processedData = useMemo(() => {
    if (!historyData || historyData.length === 0) return [];

    const bestEntries = historyData.reduce(
      (acc, curr) => {
        const existingValue = acc[curr.date]?.maxWeight ?? -Infinity;

        if (curr.maxWeight > existingValue) {
          acc[curr.date] = { ...curr };
        }

        return acc;
      },
      {} as Record<string, ExerciseProgressData>,
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
    <div className="h-64 min-h-48 outline-none mt-3 [&_.recharts-surface]:outline-none">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={processedData}>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-border-light dark:stroke-border-dark"
          />

          <XAxis dataKey="date" stroke="#ccc" fontSize={12} />

          <YAxis
            stroke="#ccc"
            fontSize={12}
            label={{
              value: t("exerciseVolume"),
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
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;

                return (
                  <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-3 rounded-lg shadow-xl text-sm">
                    <p className="text-gray-500 dark:text-gray-400 font-bold mb-2 border-b border-border-light dark:border-border-dark pb-1">
                      {label}
                    </p>
                    <div className="flex flex-col gap-1">
                      <p className="text-blue-400">
                        <span className="text-gray-400 dark:text-gray-300 font-semibold">
                          {t("volume")}:
                        </span>{" "}
                        {data.volume} kg
                      </p>
                      <p className="text-green-400">
                        <span className="text-gray-400 dark:text-gray-300 font-semibold">
                          {t("maxWeight")}:
                        </span>{" "}
                        {data.maxWeight} kg
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          <Line
            type="monotone"
            dataKey="volume"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
            name={t("volume")}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExerciseProgressChart;
