interface ChatWorkspaceProps {
  children: React.ReactNode;
}

export default function ChatWorkspace({ children }: ChatWorkspaceProps) {
  return (
    <div
      className="flex h-full min-h-screen flex-1 flex-col"
      style={{ backgroundColor: "var(--workspace-bg)" }}
    >
      {children}
    </div>
  );
}
