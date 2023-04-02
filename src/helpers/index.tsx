import { toast } from "react-hot-toast";

export const toastListErrors = (errors: (string | undefined)[]) => {
  toast.error(
    <ul>
      {errors.map((error) => (
        <li key={error} className="ml-4 list-disc">
          {error}
        </li>
      ))}
    </ul>
  );
};

// given a date, return a string like "1h ago"
export const timeAgo = (date: Date) => {
  const timeIntervals = [
    { interval: 31536000, label: "year" },
    { interval: 2592000, label: "month" },
    { interval: 86400, label: "day" },
    { interval: 3600, label: "hour" },
    { interval: 60, label: "minute" },
    { interval: 1, label: "second" },
  ];

  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const timeInterval = timeIntervals.find(
    (interval) => seconds / interval.interval >= 1
  );
  if (!timeInterval) return "just now";

  const intervalCount = Math.floor(seconds / timeInterval.interval);
  const intervalLabel =
    timeInterval.label + (intervalCount > 1 ? "s ago" : " ago");

  return `${intervalCount} ${intervalLabel}`;
};
