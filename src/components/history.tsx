"use client";

import Editor from "./editor";
import { AppErrorBoundary } from "./error-boundary";

export const SystemPrompt = () => {
  return (
    <AppErrorBoundary>
      <form className="flex flex-col space-y-5 font-mono">
        <Editor />
      </form>
    </AppErrorBoundary>
  );
};
