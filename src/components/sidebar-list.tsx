import { models, types } from "@/app/data/models";
import FileUploader from "./file-upload";
import { Separator } from "./ui/separator";
//
import { MaxLengthSelector } from "./maxlength-selector";
import { ModelSelector } from "./model-selector";
import { TemperatureSelector } from "./temperature-selector";
import { TopPSelector } from "./top-p-selector";

export interface SidebarListProps {
  userId?: string;
}

export function SidebarList({ userId }: SidebarListProps) {
  return (
    <div className="flex-1 flex-col space-y-5 overflow-auto sm:flex">
      <FileUploader />
      <Separator />
      <div className="flex-col space-y-5 p-5 pt-0">
        <ModelSelector types={types} models={models} />
        <TemperatureSelector defaultValue={[0.56]} />
        <MaxLengthSelector defaultValue={[256]} />
        <TopPSelector defaultValue={[0.9]} />
      </div>
    </div>
  );
}
