"use client";

import { MagnetButton } from "../layout";
import { Button } from "../ui/button";

export function ProceedButton() {
  const handleProceed = () => {};

  return (
    <div className="sticky inset-x-auto bottom-0 z-4 bg-background mt-4 p-3">
      <MagnetButton
        magnetStrength={0.1}
        padding={2}
      >
        <Button
          onClick={handleProceed}
          size="lg"
          className="w-full hover:bg-primary"
        >
          Proceed to Buy
        </Button>
      </MagnetButton>
    </div>
  );
}
