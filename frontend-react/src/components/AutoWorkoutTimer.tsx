import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const AutoWorkoutTimer = () => {
  const { t } = useTranslation();

  const [seconds, setSeconds] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const displayTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((val) => val.toString().padStart(2, "0"))
      .join(":");
  };

  return (
    <div className="flex flex-col items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="font-mono text-3xl md:text-4xl font-bold tracking-tight tabular-nums drop-shadow-[0_0_15px_rgba(55,128,246,0.15)]">
        {displayTime(seconds)}
      </div>
      <span className="text-[10px] uppercase tracking-widest text-primary/80 font-bold mt-0.5">
        {t("elapsed")}
      </span>
    </div>
  );
};

export default AutoWorkoutTimer;
