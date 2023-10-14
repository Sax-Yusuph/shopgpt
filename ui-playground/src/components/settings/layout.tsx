import { Text } from "@medusajs/ui";
import { ReactNode } from "react";

export default function SettingsShell({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div>
      {title ? (
        <Text size="xlarge" weight="plus" className="mb-2">
          {title}
        </Text>
      ) : null}
      {children}
    </div>
  );
}
