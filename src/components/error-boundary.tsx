"use client";

import { ErrorBoundary as DefaultErrorBoundary } from "react-error-boundary";

function Fallback({ error, resetErrorBoundary }) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

export const AppErrorBoundary = ({ children }) => (
  <DefaultErrorBoundary
    FallbackComponent={Fallback}
    onReset={details => {
      // Reset the state of your app so the error doesn't happen again
    }}
  >
    {children}
  </DefaultErrorBoundary>
);
