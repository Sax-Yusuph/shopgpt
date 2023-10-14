import { Text } from "@medusajs/ui";
import { ScrollArea } from "../scroll-area";

export default function GeneralSettings() {
  return (
    <div className="p-5">
      <Text className="mb-2">General Settings</Text>
      <ScrollArea className="w-full h-[450px]">
        <div className="space-y-3">
          <div className="w-full h-[120px] rounded-lg bg-ui-bg-subtle-hover"></div>
          <div className="w-full h-[120px] rounded-lg bg-ui-bg-subtle-hover"></div>
          <div className="w-full h-[120px] rounded-lg bg-ui-bg-subtle-hover"></div>
          <div className="w-full h-[120px] rounded-lg bg-ui-bg-subtle-hover"></div>
        </div>
      </ScrollArea>
    </div>
  );
}
