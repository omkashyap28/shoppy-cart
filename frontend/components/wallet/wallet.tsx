"use client";

import { useState } from "react";
import { SecurityDialoge } from "./mpin-form";
import { WalletCard } from "./wallet-card";
import { WalletResponse } from "@/types/wallet";
import { Button } from "../ui/button";
import { LockKeyhole } from "lucide-react";

export function Wallet() {
  const [open, setOpen] = useState(true);
  const [wallet, setWallet] = useState<WalletResponse | null>(null);

  const handleVerified = (data: WalletResponse) => {
    setWallet(data);
    setOpen(false);
  };

  const handleLock = () => {
    setWallet(null);
    setOpen(true);
  };

  return (
    <div className="w-full">
      <SecurityDialoge
        open={open}
        setOpen={setOpen}
        onSuccess={handleVerified}
      />

      {open ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <LockKeyhole className="mb-4 size-12 text-muted-foreground" />
          <p className="mb-4 text-muted-foreground">Wallet is locked.</p>
          <Button onClick={() => setOpen(true)}>Unlock Wallet</Button>
        </div>
      ) : <WalletCard wallet={wallet} onLockWallet={handleLock} />}
    </div>
  );
}
