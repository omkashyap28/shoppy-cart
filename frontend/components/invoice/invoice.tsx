"use client";

import dynamic from "next/dynamic";
import { apiFetch } from "@/lib/utils";
import type { Invoice } from "@/types/invoice";
import { useQuery } from "@tanstack/react-query";

const PDFViewer = dynamic(
  () =>
    import("@react-pdf/renderer").then(
      (mod) => mod.PDFViewer,
    ),
  {
    ssr: false,
  },
);

import { InvoiceDocument } from "./invoice-document";

interface InvoiceProps {
  invoiceId: string;
}

export function Invoice({ invoiceId }: InvoiceProps) {
  const { data: invoice, isPending, isError } =
    useQuery<Invoice>({
      queryKey: ["invoice", invoiceId],

      queryFn: async () => {
        const response = await apiFetch(
          `invoice/${invoiceId}`,
        );

        if (!response.ok) {
          throw new Error("Failed to get invoice");
        }

        return response.json();
      },

      staleTime: 5 * 60 * 1000,
      enabled: !!invoiceId,
    });

  if (isPending) {
    return <div>Loading invoice...</div>;
  }

  if (isError || !invoice) {
    return <div>Failed to load invoice.</div>;
  }

  return (
    <PDFViewer
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }}
      showToolbar
    >
      <InvoiceDocument invoice={invoice} />
    </PDFViewer>
  );
}