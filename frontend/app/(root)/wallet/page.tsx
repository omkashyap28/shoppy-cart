import { PageComponent } from "@/components/layout";
import { Wallet } from "@/components/wallet/wallet";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "",
  description: "",
  keywords: [],
};

export default function Page() {
  return (
    <PageComponent heading="Wallet">
      <Wallet />
    </PageComponent>
  );
}
