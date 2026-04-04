"use client";

import { m, softHover } from "@/components/motion-primitives";

const railItems = [
  { label: "Chats", active: true, symbol: "C" },
  { label: "People", active: false, symbol: "P" },
  { label: "Calls", active: false, symbol: "V" },
  { label: "Settings", active: false, symbol: "S" },
];

export default function ChatRail() {
  return (
    <div className="flex h-full flex-col items-center justify-between border-r border-black/10 bg-[#202c33] px-3 py-4 dark:border-white/8 dark:bg-[#111b21]">
      <div className="space-y-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#25d366] text-sm font-bold text-[#111b21]">
          V
        </div>

        <div className="space-y-2">
          {railItems.map((item) => (
            <m.button
              key={item.label}
              type="button"
              aria-label={item.label}
              className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold transition ${
                item.active
                  ? "bg-white/14 text-white"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
              }`}
              {...softHover}
            >
              {item.symbol}
            </m.button>
          ))}
        </div>
      </div>

      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-slate-950">
        Y
      </div>
    </div>
  );
}
