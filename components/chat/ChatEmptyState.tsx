export default function ChatEmptyState() {
  return (
    <div
      className="flex min-h-0 flex-1 flex-col items-center justify-center px-10 text-center"
      style={{ backgroundColor: "var(--workspace-bg)" }}
    >
      <div
        className="mb-6 flex h-24 w-24 items-center justify-center rounded-full text-3xl text-slate-500 dark:text-slate-300"
        style={{ backgroundColor: "var(--panel-surface)" }}
      >
        ✦
      </div>
      <h2 className="text-3xl font-light text-slate-900 dark:text-slate-100">
        Keep your chats flowing
      </h2>
      <p className="mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
        Select a conversation from the left to start messaging. Your active chat
        opens here, just like a real messenger layout.
      </p>
    </div>
  );
}
