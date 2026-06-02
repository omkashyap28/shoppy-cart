import React from "react";

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-640 px-4 sm:px-6 md:px-8">{children}</div>
  );
}
