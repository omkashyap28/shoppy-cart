"use client";

import { ImageKitProvider as IKProvider } from "@imagekit/next";

function getImagekitEndpoint() {
  if (process.env.NEXT_IMAGEKKIT_ENDPOINT) {
    throw new Error("Unable to find imagekit endpoint");
  }

  return String(process.env.NEXT_IMAGEKKIT_ENDPOINT);
}

export function ImageKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <IKProvider urlEndpoint={getImagekitEndpoint()}>{children}</IKProvider>
  );
}
