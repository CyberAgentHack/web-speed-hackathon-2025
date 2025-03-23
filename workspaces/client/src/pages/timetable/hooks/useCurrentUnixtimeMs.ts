import { useEffect, useState } from 'react';

// グローバルな更新間隔を5秒に設定
const UPDATE_INTERVAL = 5000;

let subscribers = new Set<(time: number) => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;

function setupGlobalInterval() {
  if (intervalId) return;

  intervalId = setInterval(() => {
    const currentTime = Date.now();
    subscribers.forEach((callback) => {
      callback(currentTime);
    });
  }, UPDATE_INTERVAL);
}

function cleanupGlobalInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function useCurrentUnixtimeMs(): number {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const callback = (time: number) => {
      setCurrentTime(time);
    };
    subscribers.add(callback);

    if (subscribers.size === 1) {
      setupGlobalInterval();
    }

    return () => {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        cleanupGlobalInterval();
      }
    };
  }, []);

  return currentTime;
}
