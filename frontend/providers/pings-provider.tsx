import { PingsToastsProvider } from "react-pings";

export function PingsProvider({ children }: { children: React.ReactNode }) {
  return (
    <PingsToastsProvider
      dismissable={false}
      toastLimit={8}
      position="top-center"
    >
      {children}
    </PingsToastsProvider>
  );
}