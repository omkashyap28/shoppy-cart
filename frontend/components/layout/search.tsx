"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SearchIcon } from "lucide-react";

export function Search() {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    window.addEventListener(
      "keydown",
      (e: KeyboardEvent) => {
        if ((e.ctrlKey && e.key === "K") || e.key === "k") {
          e.preventDefault();
          setOpen(true);
        }
      },
      false
    );
  }, []);

  // handle search here

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => setOpen(true)}
        variant="secondary"
        className="flex h-9! w-xl items-center justify-between px-3 max-lg:hidden"
      >
        <div className="flex items-center gap-2">
          <SearchIcon />
          <span className="text-sm font-normal tracking-normal text-neutral-800">
            Search products...
          </span>
        </div>
        <span className="flex items-center gap-0.5 font-mono text-xs tracking-tighter text-neutral-500">
          CtrlK
        </span>
      </Button>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="h-7 w-7 rounded-full! bg-transparent lg:hidden"
      >
        <SearchIcon />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput
            value={searchValue}
            onChangeCapture={(e) => setSearchValue(e.target.value)}
            placeholder="Type a command or search..."
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
