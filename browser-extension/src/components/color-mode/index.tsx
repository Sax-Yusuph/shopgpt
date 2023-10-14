import { Switch, Tooltip } from "@medusajs/ui";
import { useColorMode } from "./provider";

export default function ColorModeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Tooltip content={`toggle color mode`} className="z-[99]">
      <Switch checked={isDark} onCheckedChange={() => toggleColorMode()} id="toggle-dark-mode" />
    </Tooltip>
  );
}
