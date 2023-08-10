"use client";
import { ChangeEvent } from "react";
import { toast } from "react-hot-toast";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const FileUploader = () => {
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    if (event.target.files) {
      try {
        const file = event.target.files[0];

        // 1. create url from the file
        const fileUrl = URL.createObjectURL(file);

        // 2. use fetch API to read the file
        const response = await fetch(fileUrl);

        // 3. get the text from the response
        const data = await response.text();

        toast.promise(fetch("/api/train", { body: JSON.stringify({ data }), method: "POST" }), {
          loading:
            "Training ai with dataset (this usually takes a while depending on the volume of data to be processed)",
          success: "Training complete",
          error: "Error while training data",
        });

        // toast.promise(generateEmbedding(text), {
        //   loading:
        //     "Training ai with dataset (this usually takes a while depending on the volume of data to be processed)",
        //   success: "Training complete",
        //   error: "Error while training data",
        // });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="px-5">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <div className="space-y-3">
            <Label htmlFor="csv">Upload CSV</Label>
            <Input id="csv" type="file" accept=".csv" onChange={upload} />
          </div>
        </HoverCardTrigger>

        <HoverCardContent align="start" className="w-[260px] text-sm" side="left">
          Only CSV file is supported. your csv must be in the following format
          {/* <CodeBlock>
          
        </CodeBlock> */}
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default FileUploader;
