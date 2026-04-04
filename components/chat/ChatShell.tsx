"use client";

import { useEffect, useState } from "react";
import type { ReactNode, PointerEvent as ReactPointerEvent } from "react";

interface ChatShellProps {
  leftPanel: ReactNode;
  workspace: ReactNode;
}

const HANDLE_WIDTH = 10;
const DEFAULT_LEFT_PANEL_WIDTH = 420;
const MIN_LEFT_PANEL_WIDTH = 300;
const MAX_LEFT_PANEL_WIDTH = 520;
const STORAGE_KEY = "voxify-chat-shell";

export default function ChatShell({ leftPanel, workspace }: ChatShellProps) {
  const [leftPanelWidth, setLeftPanelWidth] = useState(DEFAULT_LEFT_PANEL_WIDTH);
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedState = window.localStorage.getItem(STORAGE_KEY);

    if (!savedState) {
      return;
    }

    try {
      const parsedState = JSON.parse(savedState) as {
        width?: number;
        collapsed?: boolean;
      };

      if (typeof parsedState.width === "number") {
        setLeftPanelWidth(
          Math.min(
            Math.max(parsedState.width, MIN_LEFT_PANEL_WIDTH),
            MAX_LEFT_PANEL_WIDTH,
          ),
        );
      }

      if (typeof parsedState.collapsed === "boolean") {
        setIsLeftPanelCollapsed(parsedState.collapsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        width: leftPanelWidth,
        collapsed: isLeftPanelCollapsed,
      }),
    );
  }, [isLeftPanelCollapsed, leftPanelWidth]);

  const toggleLeftPanel = () => {
    setIsLeftPanelCollapsed((previousValue) => !previousValue);
  };

  const handleStartResize = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (typeof window === "undefined") {
      return;
    }

    event.preventDefault();
    setIsDragging(true);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const rawWidth = moveEvent.clientX;

      if (rawWidth <= 140) {
        setIsLeftPanelCollapsed(true);
        return;
      }

      const nextWidth = Math.min(
        Math.max(rawWidth, MIN_LEFT_PANEL_WIDTH),
        MAX_LEFT_PANEL_WIDTH,
      );

      setLeftPanelWidth(nextWidth);
      setIsLeftPanelCollapsed(false);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div
      className="grid min-h-screen overflow-hidden border"
      style={{
        borderColor: "var(--divider)",
        backgroundColor: "var(--panel-bg)",
        gridTemplateColumns: `${
          isLeftPanelCollapsed ? "0px" : `${leftPanelWidth}px`
        } ${HANDLE_WIDTH}px minmax(0,1fr)`,
      }}
    >
      <div className="min-w-0 overflow-hidden">{!isLeftPanelCollapsed ? leftPanel : null}</div>

      <div
        role="separator"
        aria-label="Resize chat sidebar"
        aria-orientation="vertical"
        onDoubleClick={toggleLeftPanel}
        onPointerDown={handleStartResize}
        className="group relative h-full cursor-col-resize select-none transition"
        style={{
          backgroundColor: isDragging ? "var(--accent)" : "var(--divider)",
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/12 dark:bg-white/12" />
      </div>

      <div className="min-w-0">{workspace}</div>
    </div>
  );
}
