import type { User } from "@/types/chat";

interface PresenceBadgeProps {
  user: Pick<User, "isOnline" | "lastSeen">;
}

const formatLastSeen = (lastSeen: string) => {
  const date = new Date(lastSeen);

  if (Number.isNaN(date.getTime())) {
    return "Offline";
  }

  return `Last seen ${date.toLocaleString()}`;
};

export default function PresenceBadge({ user }: PresenceBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${
        user.isOnline
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
          : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          user.isOnline ? "bg-emerald-500" : "bg-slate-500 dark:bg-slate-400"
        }`}
      />
      {user.isOnline ? "Online" : formatLastSeen(user.lastSeen)}
    </span>
  );
}
