export interface TimeUnit {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function convertToSeconds(time: TimeUnit): number {
  return (
    time.days * 86400 +
    time.hours * 3600 +
    time.minutes * 60 +
    time.seconds
  );
}

export function convertFromSeconds(totalSeconds: number): TimeUnit {
  let remaining = Math.max(0, totalSeconds);
  
  const days = Math.floor(remaining / 86400);
  remaining %= 86400;
  
  const hours = Math.floor(remaining / 3600);
  remaining %= 3600;
  
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return { days, hours, minutes, seconds };
}

export function parseTimeInput(value: string | undefined): number {
  const parsed = parseInt(value || "0");
  return isNaN(parsed) ? 0 : parsed;
}