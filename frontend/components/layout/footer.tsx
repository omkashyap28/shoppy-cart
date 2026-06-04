"use client";

import { Button } from "../ui/button";
import { Logo } from "./logo";

export function Footer() {
  const handleClick = () => {
    document.body.scroll({
      top: 0,
      behavior: "smooth",
    });
    document.documentElement.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full">
      <div className="w-full">
        <Button
          onClick={handleClick}
          className="h-10 w-full bg-transparent text-foreground hover:bg-input"
        >
          Go to Top
        </Button>
      </div>
      <Logo />
      <div className="w-full text-center text-sm font-light tracking-tight">
        &copy; All rights reserved for Shoppy Cart
      </div>
    </footer>
  );
}
