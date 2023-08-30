"use client";

import { MDXEditorMethods } from "@mdxeditor/editor";

import { forwardRef } from "react";
import { Textarea } from "./ui/textarea";

type Props = { value: string; setValue(s: string): void; noPlugins?: boolean; className?: string };

const Editor = forwardRef<MDXEditorMethods, Props>((props, ref) => {
  const { value, setValue, noPlugins = false, className } = props;

  return (
    <Textarea
      placeholder="You are a helpful assistant"
      className={
        className ||
        `
   p-3 rounded-md !focus:border-accent-foreground
   border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background
   font-mono
   min-h-[300px] focus:bg-accent 
`
      }
    />
  );
});

Editor.displayName = "MarkdownEditor";
export default Editor;
