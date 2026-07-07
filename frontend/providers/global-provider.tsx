import { TooltipProvider } from "@/components/ui/tooltip";
import { ImageKitProvider } from "./imagekit-provider";
import QueryProvider from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { PingsProvider } from "./pings-provider";

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <ImageKitProvider>
          <TooltipProvider>
            <PingsProvider>{children}</PingsProvider>
          </TooltipProvider>
        </ImageKitProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
