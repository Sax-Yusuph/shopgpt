import { SystemPromptHistory } from "./history";
import ShopifyFetcher, { StorePreference } from "./shopifyfetcher";
import { Separator } from "./ui/separator";

export interface SidebarListProps {
  userId?: string;
}

export function SidebarList({ userId }: SidebarListProps) {
  return (
    <div className="flex-1 flex-col space-y-5 overflow-auto sm:flex">
      <ShopifyFetcher />

      <Separator />
      <StorePreference />

      <Separator />

      <SystemPromptHistory />

      <Separator />
    </div>
  );
}
