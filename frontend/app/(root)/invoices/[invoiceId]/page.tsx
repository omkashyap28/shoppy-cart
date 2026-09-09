import { Invoice } from "@/components/invoice/invoice";
import { Metadata } from "next";

interface Props {
  params: Promise<{ invoiceId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { invoiceId } = await params;
  return {
    title: `Download invoice for ${invoiceId}`,
    description: `View | download invoice for ${invoiceId}`
  }
}

export default async function InvoicePage({ params }: Props) {
  const { invoiceId } = await params;

  return <Invoice invoiceId={invoiceId} />

}