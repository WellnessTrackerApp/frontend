import { useEffect, useState } from "react";

interface RestTimerProps {
  time: number;
  disableTimer: () => void;
}

const RestTimer = ({ time, disableTimer }: RestTimerProps) => {
  const [currentTime, setCurrentTime] = useState<number>(time);

  useEffect(() => {
    setCurrentTime(time);
  }, [time]);

  useEffect(() => {
    if (currentTime <= 0) {
      disableTimer();
      return;
    }

    const interval = setInterval(() => {
      setCurrentTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTime, disableTimer]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes !== 0
      ? `${minutes}:${seconds.toString().padStart(2, "0")}`
      : `${seconds}s`;
  };

  if (currentTime <= 0) return null;

  return <span>{formatTime(currentTime)}</span>;
};

export default RestTimer;
