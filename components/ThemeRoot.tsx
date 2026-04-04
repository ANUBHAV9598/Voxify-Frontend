"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { MotionRoot } from "./motion-primitives";

type PaletteMode = "light" | "dark";

interface PaletteTokens {
  appBg: string;
  workspaceBg: string;
  panelBg: string;
  panelMuted: string;
  panelSurface: string;
  inputBg: string;
  panelSelected: string;
  divider: string;
  accent: string;
  accentSoft: string;
  accentForeground: string;
  bubbleOwn: string;
  bubbleOwnForeground: string;
  bubbleOther: string;
  bubbleOtherForeground: string;
}

interface PalettePreset {
  id: string;
  name: string;
  swatch: string;
  light: PaletteTokens;
  dark: PaletteTokens;
}

interface PaletteContextValue {
  palettes: PalettePreset[];
  selectedPalette: string;
  setSelectedPalette: (paletteId: string) => void;
}

const PALETTE_STORAGE_KEY = "voxify-ui-palette";

export const PALETTES: PalettePreset[] = [
  {
    id: "mint-bloom",
    name: "Mint Bloom",
    swatch: "#25d366",
    light: {
      appBg: "#e8f5ef",
      workspaceBg: "#f6fffb",
      panelBg: "#f9fffc",
      panelMuted: "#edf7f1",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#daf7e8",
      divider: "#c6ddd0",
      accent: "#25d366",
      accentSoft: "#d8f8e2",
      accentForeground: "#0e2d18",
      bubbleOwn: "#d7fae3",
      bubbleOwnForeground: "#0d2316",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#162018",
    },
    dark: {
      appBg: "#07150f",
      workspaceBg: "#081c13",
      panelBg: "#0d2017",
      panelMuted: "#11261c",
      panelSurface: "#132b20",
      inputBg: "#163126",
      panelSelected: "#183528",
      divider: "#1f3f31",
      accent: "#25d366",
      accentSoft: "#123724",
      accentForeground: "#dcffe8",
      bubbleOwn: "#115334",
      bubbleOwnForeground: "#ecfff4",
      bubbleOther: "#183127",
      bubbleOtherForeground: "#effff4",
    },
  },
  {
    id: "ocean-glow",
    name: "Ocean Glow",
    swatch: "#2dd4bf",
    light: {
      appBg: "#e8fbfb",
      workspaceBg: "#f3fffe",
      panelBg: "#f8ffff",
      panelMuted: "#eaf7f7",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#d7fbf5",
      divider: "#c8e1df",
      accent: "#2dd4bf",
      accentSoft: "#d5fbf6",
      accentForeground: "#0a2f2a",
      bubbleOwn: "#d4fbf4",
      bubbleOwnForeground: "#082723",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#12201f",
    },
    dark: {
      appBg: "#051615",
      workspaceBg: "#071d1c",
      panelBg: "#0b2524",
      panelMuted: "#0e2d2c",
      panelSurface: "#133534",
      inputBg: "#163d3c",
      panelSelected: "#164442",
      divider: "#1d4f4d",
      accent: "#2dd4bf",
      accentSoft: "#123a37",
      accentForeground: "#e2fffb",
      bubbleOwn: "#0f5850",
      bubbleOwnForeground: "#e8fffb",
      bubbleOther: "#153433",
      bubbleOtherForeground: "#efffff",
    },
  },
  {
    id: "cobalt-pop",
    name: "Cobalt Pop",
    swatch: "#3b82f6",
    light: {
      appBg: "#edf4ff",
      workspaceBg: "#f7faff",
      panelBg: "#fbfdff",
      panelMuted: "#eef3fb",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#dceaff",
      divider: "#cfd8ea",
      accent: "#3b82f6",
      accentSoft: "#dbeafe",
      accentForeground: "#0d2c59",
      bubbleOwn: "#dbeafe",
      bubbleOwnForeground: "#11243f",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#172033",
    },
    dark: {
      appBg: "#07101d",
      workspaceBg: "#091625",
      panelBg: "#0d1b2d",
      panelMuted: "#12233a",
      panelSurface: "#162b46",
      inputBg: "#1a3554",
      panelSelected: "#16385f",
      divider: "#204368",
      accent: "#3b82f6",
      accentSoft: "#15325b",
      accentForeground: "#eaf3ff",
      bubbleOwn: "#184d9a",
      bubbleOwnForeground: "#eff6ff",
      bubbleOther: "#172c44",
      bubbleOtherForeground: "#f1f6ff",
    },
  },
  {
    id: "violet-spark",
    name: "Violet Spark",
    swatch: "#8b5cf6",
    light: {
      appBg: "#f4efff",
      workspaceBg: "#fbf8ff",
      panelBg: "#fefcff",
      panelMuted: "#f2eefb",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#ece2ff",
      divider: "#ddd2ed",
      accent: "#8b5cf6",
      accentSoft: "#ede3ff",
      accentForeground: "#2a1656",
      bubbleOwn: "#efe5ff",
      bubbleOwnForeground: "#261641",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#211b2e",
    },
    dark: {
      appBg: "#11091d",
      workspaceBg: "#160c24",
      panelBg: "#1c1130",
      panelMuted: "#24183c",
      panelSurface: "#2d1e49",
      inputBg: "#37255a",
      panelSelected: "#3d2a68",
      divider: "#4a347c",
      accent: "#8b5cf6",
      accentSoft: "#35265a",
      accentForeground: "#f5efff",
      bubbleOwn: "#5b33a5",
      bubbleOwnForeground: "#fbf7ff",
      bubbleOther: "#2e2145",
      bubbleOtherForeground: "#f7f2ff",
    },
  },
  {
    id: "rose-pulse",
    name: "Rose Pulse",
    swatch: "#f43f5e",
    light: {
      appBg: "#fff0f4",
      workspaceBg: "#fff8fa",
      panelBg: "#fffdfd",
      panelMuted: "#fbecf0",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#ffdfe8",
      divider: "#ecd2da",
      accent: "#f43f5e",
      accentSoft: "#ffe0e7",
      accentForeground: "#5c1220",
      bubbleOwn: "#ffe1e8",
      bubbleOwnForeground: "#481521",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#2b1820",
    },
    dark: {
      appBg: "#1b0910",
      workspaceBg: "#210c14",
      panelBg: "#2a111b",
      panelMuted: "#341622",
      panelSurface: "#411d2b",
      inputBg: "#4a2232",
      panelSelected: "#57273b",
      divider: "#693148",
      accent: "#f43f5e",
      accentSoft: "#5a2330",
      accentForeground: "#fff0f3",
      bubbleOwn: "#92253b",
      bubbleOwnForeground: "#fff6f7",
      bubbleOther: "#41202c",
      bubbleOtherForeground: "#fff3f5",
    },
  },
  {
    id: "sunset-amber",
    name: "Sunset Amber",
    swatch: "#f59e0b",
    light: {
      appBg: "#fff6e8",
      workspaceBg: "#fffbf3",
      panelBg: "#fffefb",
      panelMuted: "#faf1df",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#ffedc3",
      divider: "#ead8b8",
      accent: "#f59e0b",
      accentSoft: "#ffefc9",
      accentForeground: "#5a3a03",
      bubbleOwn: "#ffefca",
      bubbleOwnForeground: "#4a3408",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#2d2314",
    },
    dark: {
      appBg: "#1a1205",
      workspaceBg: "#211706",
      panelBg: "#2a1e0a",
      panelMuted: "#33250d",
      panelSurface: "#3f2e11",
      inputBg: "#4a3814",
      panelSelected: "#5e4617",
      divider: "#745821",
      accent: "#f59e0b",
      accentSoft: "#5c4211",
      accentForeground: "#fff6e4",
      bubbleOwn: "#9a6307",
      bubbleOwnForeground: "#fff8ed",
      bubbleOther: "#422f14",
      bubbleOtherForeground: "#fff7e8",
    },
  },
  {
    id: "coral-flare",
    name: "Coral Flare",
    swatch: "#fb7185",
    light: {
      appBg: "#fff1f3",
      workspaceBg: "#fff8f9",
      panelBg: "#fffdfd",
      panelMuted: "#fcecef",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#ffdfe4",
      divider: "#ebd2d8",
      accent: "#fb7185",
      accentSoft: "#ffe1e6",
      accentForeground: "#611826",
      bubbleOwn: "#ffe3e8",
      bubbleOwnForeground: "#4d1721",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#2c171b",
    },
    dark: {
      appBg: "#1a0b0e",
      workspaceBg: "#210d11",
      panelBg: "#2a1217",
      panelMuted: "#351820",
      panelSurface: "#411f28",
      inputBg: "#4d2531",
      panelSelected: "#5a2c3a",
      divider: "#6c3747",
      accent: "#fb7185",
      accentSoft: "#5f2631",
      accentForeground: "#fff1f4",
      bubbleOwn: "#a63148",
      bubbleOwnForeground: "#fff8f9",
      bubbleOther: "#42212b",
      bubbleOtherForeground: "#fff4f6",
    },
  },
  {
    id: "lavender-haze",
    name: "Lavender Haze",
    swatch: "#a78bfa",
    light: {
      appBg: "#f6f3ff",
      workspaceBg: "#fbfaff",
      panelBg: "#fefeff",
      panelMuted: "#f2eefc",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#ece5ff",
      divider: "#ddd7ed",
      accent: "#a78bfa",
      accentSoft: "#efe9ff",
      accentForeground: "#321f68",
      bubbleOwn: "#efe9ff",
      bubbleOwnForeground: "#2a1c50",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#241f31",
    },
    dark: {
      appBg: "#120d1b",
      workspaceBg: "#161122",
      panelBg: "#1d172d",
      panelMuted: "#241e36",
      panelSurface: "#2d2743",
      inputBg: "#362f51",
      panelSelected: "#41385f",
      divider: "#4f446f",
      accent: "#a78bfa",
      accentSoft: "#3d3358",
      accentForeground: "#faf7ff",
      bubbleOwn: "#6e57c8",
      bubbleOwnForeground: "#fbfaff",
      bubbleOther: "#2e2840",
      bubbleOtherForeground: "#f7f4ff",
    },
  },
  {
    id: "berry-jam",
    name: "Berry Jam",
    swatch: "#c026d3",
    light: {
      appBg: "#fdf0ff",
      workspaceBg: "#fff7ff",
      panelBg: "#fffdfd",
      panelMuted: "#f9ecfb",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#f8ddfc",
      divider: "#ead2ed",
      accent: "#c026d3",
      accentSoft: "#f6d8fa",
      accentForeground: "#4c0c53",
      bubbleOwn: "#f7d8fb",
      bubbleOwnForeground: "#3e113f",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#2c162e",
    },
    dark: {
      appBg: "#19071d",
      workspaceBg: "#210a25",
      panelBg: "#2a0f31",
      panelMuted: "#34143d",
      panelSurface: "#411a4b",
      inputBg: "#4c2157",
      panelSelected: "#5a2968",
      divider: "#6c327c",
      accent: "#c026d3",
      accentSoft: "#56255c",
      accentForeground: "#fff2ff",
      bubbleOwn: "#7c1a88",
      bubbleOwnForeground: "#fff8ff",
      bubbleOther: "#43204a",
      bubbleOtherForeground: "#fff4ff",
    },
  },
  {
    id: "lime-wave",
    name: "Lime Wave",
    swatch: "#84cc16",
    light: {
      appBg: "#f5fbe7",
      workspaceBg: "#fbfff5",
      panelBg: "#fefff9",
      panelMuted: "#f1f7e4",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#e7f7c8",
      divider: "#d8e6c4",
      accent: "#84cc16",
      accentSoft: "#eaf9cf",
      accentForeground: "#264205",
      bubbleOwn: "#e9f8cc",
      bubbleOwnForeground: "#23320a",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#232b18",
    },
    dark: {
      appBg: "#111806",
      workspaceBg: "#141f08",
      panelBg: "#1a270b",
      panelMuted: "#212f0f",
      panelSurface: "#293b15",
      inputBg: "#30461a",
      panelSelected: "#3a561d",
      divider: "#466724",
      accent: "#84cc16",
      accentSoft: "#355116",
      accentForeground: "#f7ffea",
      bubbleOwn: "#527f10",
      bubbleOwnForeground: "#fbffef",
      bubbleOther: "#2a3c19",
      bubbleOtherForeground: "#f8ffef",
    },
  },
  {
    id: "peach-fizz",
    name: "Peach Fizz",
    swatch: "#fb923c",
    light: {
      appBg: "#fff4ea",
      workspaceBg: "#fffaf5",
      panelBg: "#fffefc",
      panelMuted: "#fbeddf",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#ffe5d2",
      divider: "#ecd6c7",
      accent: "#fb923c",
      accentSoft: "#ffe6d3",
      accentForeground: "#5a2500",
      bubbleOwn: "#ffe4d0",
      bubbleOwnForeground: "#4a2309",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#2f2019",
    },
    dark: {
      appBg: "#1b1008",
      workspaceBg: "#22140a",
      panelBg: "#2b190d",
      panelMuted: "#341f12",
      panelSurface: "#412719",
      inputBg: "#4d2e1d",
      panelSelected: "#5b3621",
      divider: "#6f4329",
      accent: "#fb923c",
      accentSoft: "#60341a",
      accentForeground: "#fff5eb",
      bubbleOwn: "#a75418",
      bubbleOwnForeground: "#fff8f2",
      bubbleOther: "#43281d",
      bubbleOtherForeground: "#fff7ef",
    },
  },
  {
    id: "ruby-night",
    name: "Ruby Night",
    swatch: "#e11d48",
    light: {
      appBg: "#fff0f4",
      workspaceBg: "#fff8fa",
      panelBg: "#fffdfd",
      panelMuted: "#fbe9ef",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#ffdce5",
      divider: "#ebced7",
      accent: "#e11d48",
      accentSoft: "#ffdbe5",
      accentForeground: "#57081a",
      bubbleOwn: "#ffdbe5",
      bubbleOwnForeground: "#470d1b",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#2c171c",
    },
    dark: {
      appBg: "#19070d",
      workspaceBg: "#21090f",
      panelBg: "#2a0f16",
      panelMuted: "#34141d",
      panelSurface: "#411b25",
      inputBg: "#4b1f2b",
      panelSelected: "#5a2432",
      divider: "#6b2c3d",
      accent: "#e11d48",
      accentSoft: "#5a1e2c",
      accentForeground: "#fff2f5",
      bubbleOwn: "#911631",
      bubbleOwnForeground: "#fff7f9",
      bubbleOther: "#42202a",
      bubbleOtherForeground: "#fff3f6",
    },
  },
  {
    id: "forest-moss",
    name: "Forest Moss",
    swatch: "#22c55e",
    light: {
      appBg: "#edf9f0",
      workspaceBg: "#f7fff8",
      panelBg: "#fcfffc",
      panelMuted: "#ebf6ee",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#dbf5e3",
      divider: "#cee0d2",
      accent: "#22c55e",
      accentSoft: "#d7f7e1",
      accentForeground: "#0d361b",
      bubbleOwn: "#d9f7e2",
      bubbleOwnForeground: "#142a1a",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#192319",
    },
    dark: {
      appBg: "#08150c",
      workspaceBg: "#0b1b0f",
      panelBg: "#102314",
      panelMuted: "#142b19",
      panelSurface: "#1a3520",
      inputBg: "#1f4025",
      panelSelected: "#234c2b",
      divider: "#2b5b33",
      accent: "#22c55e",
      accentSoft: "#173721",
      accentForeground: "#edfff3",
      bubbleOwn: "#166a37",
      bubbleOwnForeground: "#f3fff7",
      bubbleOther: "#1c3422",
      bubbleOtherForeground: "#f1fff5",
    },
  },
  {
    id: "teal-storm",
    name: "Teal Storm",
    swatch: "#14b8a6",
    light: {
      appBg: "#e8f9f6",
      workspaceBg: "#f5fffd",
      panelBg: "#fbfffe",
      panelMuted: "#e9f5f3",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#d6f7f1",
      divider: "#c9dfdb",
      accent: "#14b8a6",
      accentSoft: "#d2faf4",
      accentForeground: "#063933",
      bubbleOwn: "#d4faf3",
      bubbleOwnForeground: "#0e2d2a",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#152422",
    },
    dark: {
      appBg: "#051614",
      workspaceBg: "#071d1a",
      panelBg: "#0b2521",
      panelMuted: "#0e2d28",
      panelSurface: "#133732",
      inputBg: "#16413a",
      panelSelected: "#184e46",
      divider: "#1f5d54",
      accent: "#14b8a6",
      accentSoft: "#113a34",
      accentForeground: "#edfffc",
      bubbleOwn: "#0f6d62",
      bubbleOwnForeground: "#effffd",
      bubbleOther: "#163632",
      bubbleOtherForeground: "#f0fffd",
    },
  },
  {
    id: "skyline",
    name: "Skyline",
    swatch: "#0ea5e9",
    light: {
      appBg: "#ebf7ff",
      workspaceBg: "#f6fbff",
      panelBg: "#fcfeff",
      panelMuted: "#edf4fa",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#dcefff",
      divider: "#cfdde9",
      accent: "#0ea5e9",
      accentSoft: "#d8f1ff",
      accentForeground: "#083a57",
      bubbleOwn: "#d8f1ff",
      bubbleOwnForeground: "#0e2f43",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#18222c",
    },
    dark: {
      appBg: "#07131a",
      workspaceBg: "#091923",
      panelBg: "#0d2130",
      panelMuted: "#12293b",
      panelSurface: "#173347",
      inputBg: "#1a3d55",
      panelSelected: "#1f4963",
      divider: "#255674",
      accent: "#0ea5e9",
      accentSoft: "#123c57",
      accentForeground: "#eff9ff",
      bubbleOwn: "#0c6b98",
      bubbleOwnForeground: "#f2fbff",
      bubbleOther: "#193444",
      bubbleOtherForeground: "#f4fbff",
    },
  },
  {
    id: "midnight-ink",
    name: "Midnight Ink",
    swatch: "#6366f1",
    light: {
      appBg: "#eff1ff",
      workspaceBg: "#f8f9ff",
      panelBg: "#fdfdff",
      panelMuted: "#eeeffa",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#e1e4ff",
      divider: "#d4d7eb",
      accent: "#6366f1",
      accentSoft: "#e1e2ff",
      accentForeground: "#202257",
      bubbleOwn: "#e3e5ff",
      bubbleOwnForeground: "#1d2044",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#1d2030",
    },
    dark: {
      appBg: "#0c0d1b",
      workspaceBg: "#101224",
      panelBg: "#151931",
      panelMuted: "#1b203d",
      panelSurface: "#23284c",
      inputBg: "#2a3160",
      panelSelected: "#333b72",
      divider: "#40498a",
      accent: "#6366f1",
      accentSoft: "#2b2e5c",
      accentForeground: "#f3f3ff",
      bubbleOwn: "#4146ad",
      bubbleOwnForeground: "#f7f8ff",
      bubbleOther: "#262b47",
      bubbleOtherForeground: "#f5f6ff",
    },
  },
  {
    id: "orchid-dream",
    name: "Orchid Dream",
    swatch: "#d946ef",
    light: {
      appBg: "#fef0ff",
      workspaceBg: "#fff8ff",
      panelBg: "#fffdfd",
      panelMuted: "#faebfb",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#f9ddfd",
      divider: "#ead1ed",
      accent: "#d946ef",
      accentSoft: "#fad9ff",
      accentForeground: "#55095f",
      bubbleOwn: "#fad9ff",
      bubbleOwnForeground: "#411545",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#2b172d",
    },
    dark: {
      appBg: "#18081b",
      workspaceBg: "#1f0a22",
      panelBg: "#280f2c",
      panelMuted: "#311338",
      panelSurface: "#3d1946",
      inputBg: "#481d53",
      panelSelected: "#572466",
      divider: "#692d7a",
      accent: "#d946ef",
      accentSoft: "#5a2461",
      accentForeground: "#fff3ff",
      bubbleOwn: "#8c27a0",
      bubbleOwnForeground: "#fff7ff",
      bubbleOther: "#402049",
      bubbleOtherForeground: "#fff4ff",
    },
  },
  {
    id: "steel-cyan",
    name: "Steel Cyan",
    swatch: "#06b6d4",
    light: {
      appBg: "#ebfbff",
      workspaceBg: "#f7feff",
      panelBg: "#fcffff",
      panelMuted: "#ebf4f7",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#d8f6ff",
      divider: "#cddde3",
      accent: "#06b6d4",
      accentSoft: "#d5f7fd",
      accentForeground: "#053846",
      bubbleOwn: "#d6f8fd",
      bubbleOwnForeground: "#0c2d35",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#182126",
    },
    dark: {
      appBg: "#051419",
      workspaceBg: "#071a20",
      panelBg: "#0b2229",
      panelMuted: "#0f2a33",
      panelSurface: "#133541",
      inputBg: "#163f4d",
      panelSelected: "#184b5b",
      divider: "#1f5a6d",
      accent: "#06b6d4",
      accentSoft: "#123943",
      accentForeground: "#effcff",
      bubbleOwn: "#0a7284",
      bubbleOwnForeground: "#f0fdff",
      bubbleOther: "#163541",
      bubbleOtherForeground: "#f1feff",
    },
  },
  {
    id: "terra-cotta",
    name: "Terra Cotta",
    swatch: "#ea580c",
    light: {
      appBg: "#fff2eb",
      workspaceBg: "#fff9f6",
      panelBg: "#fffdfc",
      panelMuted: "#fbece5",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#ffe3d4",
      divider: "#ebd4c7",
      accent: "#ea580c",
      accentSoft: "#ffe2d2",
      accentForeground: "#5a1f00",
      bubbleOwn: "#ffe3d4",
      bubbleOwnForeground: "#471f0b",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#2b1d18",
    },
    dark: {
      appBg: "#1a0d07",
      workspaceBg: "#21100a",
      panelBg: "#2a150d",
      panelMuted: "#341a11",
      panelSurface: "#411f15",
      inputBg: "#4d2619",
      panelSelected: "#5c2d1c",
      divider: "#6e3822",
      accent: "#ea580c",
      accentSoft: "#5e2812",
      accentForeground: "#fff4ed",
      bubbleOwn: "#993810",
      bubbleOwnForeground: "#fff8f3",
      bubbleOther: "#432319",
      bubbleOtherForeground: "#fff6f0",
    },
  },
  {
    id: "mono-frost",
    name: "Mono Frost",
    swatch: "#64748b",
    light: {
      appBg: "#f1f5f9",
      workspaceBg: "#f8fbfd",
      panelBg: "#fcfdff",
      panelMuted: "#edf2f6",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#dde6ee",
      divider: "#d0d7e0",
      accent: "#64748b",
      accentSoft: "#dee6ef",
      accentForeground: "#1f2c3a",
      bubbleOwn: "#dfe7ef",
      bubbleOwnForeground: "#202c39",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#1c2530",
    },
    dark: {
      appBg: "#0f1318",
      workspaceBg: "#13181f",
      panelBg: "#181e26",
      panelMuted: "#1e2630",
      panelSurface: "#27323f",
      inputBg: "#2f3b4a",
      panelSelected: "#38485a",
      divider: "#435569",
      accent: "#94a3b8",
      accentSoft: "#2c3743",
      accentForeground: "#f8fbff",
      bubbleOwn: "#4a5a70",
      bubbleOwnForeground: "#f8fbff",
      bubbleOther: "#293340",
      bubbleOtherForeground: "#f5f8fb",
    },
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    swatch: "#eab308",
    light: {
      appBg: "#fff9e8",
      workspaceBg: "#fffdf5",
      panelBg: "#fffefb",
      panelMuted: "#faf3df",
      panelSurface: "#ffffff",
      inputBg: "#ffffff",
      panelSelected: "#fcedb8",
      divider: "#eadbae",
      accent: "#eab308",
      accentSoft: "#fdf0be",
      accentForeground: "#574104",
      bubbleOwn: "#fdf0bf",
      bubbleOwnForeground: "#43340a",
      bubbleOther: "#ffffff",
      bubbleOtherForeground: "#2d2617",
    },
    dark: {
      appBg: "#171204",
      workspaceBg: "#1d1606",
      panelBg: "#251d09",
      panelMuted: "#2d240d",
      panelSurface: "#382e12",
      inputBg: "#433718",
      panelSelected: "#534521",
      divider: "#655527",
      accent: "#eab308",
      accentSoft: "#554314",
      accentForeground: "#fff9e8",
      bubbleOwn: "#8d6c08",
      bubbleOwnForeground: "#fffaf0",
      bubbleOther: "#3a2f14",
      bubbleOtherForeground: "#fff9ed",
    },
  },
];

const PaletteContext = createContext<PaletteContextValue | null>(null);

function PaletteSync({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { resolvedTheme } = useTheme();
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0].id);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedPalette = window.localStorage.getItem(PALETTE_STORAGE_KEY);

    if (storedPalette && PALETTES.some((palette) => palette.id === storedPalette)) {
      setSelectedPalette(storedPalette);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(PALETTE_STORAGE_KEY, selectedPalette);
  }, [selectedPalette]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const palette =
      PALETTES.find((candidate) => candidate.id === selectedPalette) ?? PALETTES[0];
    const mode: PaletteMode = resolvedTheme === "dark" ? "dark" : "light";
    const tokens = palette[mode];
    const root = document.documentElement;

    root.dataset.palette = palette.id;
    root.style.setProperty("--app-bg", tokens.appBg);
    root.style.setProperty("--workspace-bg", tokens.workspaceBg);
    root.style.setProperty("--panel-bg", tokens.panelBg);
    root.style.setProperty("--panel-muted", tokens.panelMuted);
    root.style.setProperty("--panel-surface", tokens.panelSurface);
    root.style.setProperty("--input-bg", tokens.inputBg);
    root.style.setProperty("--panel-selected", tokens.panelSelected);
    root.style.setProperty("--divider", tokens.divider);
    root.style.setProperty("--accent", tokens.accent);
    root.style.setProperty("--accent-soft", tokens.accentSoft);
    root.style.setProperty("--accent-foreground", tokens.accentForeground);
    root.style.setProperty("--bubble-own", tokens.bubbleOwn);
    root.style.setProperty("--bubble-own-foreground", tokens.bubbleOwnForeground);
    root.style.setProperty("--bubble-other", tokens.bubbleOther);
    root.style.setProperty("--bubble-other-foreground", tokens.bubbleOtherForeground);
  }, [resolvedTheme, selectedPalette]);

  const contextValue = useMemo(
    () => ({
      palettes: PALETTES,
      selectedPalette,
      setSelectedPalette,
    }),
    [selectedPalette],
  );

  return (
    <PaletteContext.Provider value={contextValue}>
      <MotionRoot>{children}</MotionRoot>
    </PaletteContext.Provider>
  );
}

export function usePaletteTheme() {
  const context = useContext(PaletteContext);

  if (!context) {
    throw new Error("usePaletteTheme must be used within ThemeRoot");
  }

  return context;
}

export default function ThemeRoot({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="voxify-theme"
    >
      <PaletteSync>{children}</PaletteSync>
    </NextThemesProvider>
  );
}
