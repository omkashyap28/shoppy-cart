import { Logo } from "@/components/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 | Page Not Found",
  description: "Page Not Found",
  openGraph: {
    title: "404 | Page Not Found",
    description: "Page Not Found",
    type: "website",
  },
  twitter: {
    title: "404 | Page Not Found",
    description: "Page Not Found",
    card: "summary_large_image",
  },
};

export default function NotFound() {

  return (
    <div className="dark">
      <div className="relative min-h-screen overflow-hidden bg-neutral-50 font-mono transition-colors duration-500 dark:bg-neutral-950 flex flex-col items-center justify-center gap-3">

        <div className="pointer-events-none absolute -left-[10%] -top-[10%] h-[480px] w-[480px] animate-[drift1_14s_ease-in-out_infinite] rounded-full bg-neutral-300 opacity-50 blur-[72px] transition-colors duration-500 dark:bg-neutral-800" />

        <div className="pointer-events-none absolute -bottom-[8%] -right-[8%] h-[380px] w-[380px] animate-[drift2_18s_ease-in-out_infinite] rounded-full bg-neutral-400 opacity-50 blur-[72px] transition-colors duration-500 dark:bg-neutral-700" />

        <div className="pointer-events-none absolute left-[55%] top-[40%] h-[300px] w-[300px] animate-[drift3_22s_ease-in-out_infinite] rounded-full bg-neutral-200 opacity-55 blur-[72px] transition-colors duration-500 dark:bg-neutral-900" />

        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 text-neutral-900 transition-colors duration-500 dark:text-neutral-100">
            <Logo />
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <div className="text-xl font-semibold tracking-tight">404</div>
          </div>

          <h1 className="m-0 font-mono text-4xl font-bold tracking-tight text-neutral-900 transition-colors duration-500 dark:text-neutral-100">
            Page Not Found
          </h1>

          <p className="m-0 text-sm tracking-wide text-neutral-500 transition-colors duration-500 dark:text-neutral-500">
            The page you're looking for doesn't exist.
          </p>
        </div>
      </div>
    </div>
  );
}