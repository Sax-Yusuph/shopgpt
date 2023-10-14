import medusaPreset from "@medusajs/ui-preset";
/** @type {import('tailwindcss').Config} */
export default {
  // important: '.extension',
  presets: [medusaPreset],
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}", "./node_modules/@medusajs/ui/dist/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pinky: "#c295e9",
      },
      animation: {
        "spin-once": "spin 0.5s linear .5",
      },
    },
  },
  hoverOnlyWhenSupported: true,
};

/**
 * txt-compact-small-plus transition-fg text-ui-fg-subtle inline-flex items-center justify-center rounded-full border border-transparent bg-transparent px-3 py-1.5 outline-none hover:text-ui-fg-base focus:border-ui-border-interactive focus:!shadow-borders-focus focus:bg-ui-bg-base data-[state=active]:text-ui-fg-base data-[state=active]:bg-ui-bg-base data-[state=active]:shadow-elevation-card-rest
 */
