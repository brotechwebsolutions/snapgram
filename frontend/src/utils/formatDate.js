import { formatDistanceToNow, format } from "date-fns";
export const timeAgo = (date) => formatDistanceToNow(new Date(date), { addSuffix: true });
export const formatDate = (date) => format(new Date(date), "MMMM d, yyyy");
export const formatTime = (date) => format(new Date(date), "h:mm a");
export const formatShort = (date) => {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff/60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h`;
  if (diff < 604800000) return `${Math.floor(diff/86400000)}d`;
  return format(d, "MMM d");
};
