"use client";

import { useEffect, useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandShortcut,
} from "@/components/ui/command";
import {
  CornerDownLeft,
  History,
  Mic,
  SearchIcon,
  TextSearch,
  TrendingUp,
} from "lucide-react";
import { apiFetch, debounce } from "@/lib/utils";
import { useAppStore } from "@/store/store";

export function Search() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userSearches, setUserSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const userId = useAppStore((state) => state.userId);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", down);

    return () => window.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    (() => {
      if (!searchValue.trim()) {
        setSearchResults([]);
      }
    })();
  }, [searchValue]);

  const setSearchValueToUser = async (value: string) => {
    if (!userId && !searchValue) return;

    await apiFetch(`search?query=${value}&userId=${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    getUserSearches();
  };

  async function getUserSearches() {
    if (!userId) return;

    const response = await apiFetch(`search/recent/${userId}`);

    if (!response.ok) {
      throw new Error("Unable to fetch user recent searches");
    }

    const data = await response.json();
    if (data.length > 0) {
      setUserSearches(
        data.map(
          (item: {
            searchId: string;
            searchText: string;
            searchedAt: string;
          }) => item.searchText
        )
      );
    } else {
      setUserSearches([]);
    }
  }

  useEffect(() => {
    getUserSearches();
  }, [userId]);

  useEffect(() => {
    async function getTrendingSearches() {
      const response = await fetch(`api/search/trending`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Unable to fetch trending searches");
      }

      const data = await response.json();
      if (data) {
        setTrendingSearches(data);
      } else {
        setTrendingSearches([]);
      }
    }
    getTrendingSearches();
  }, []);

  // handle search here
  const handleSearch = useMemo(
    () =>
      debounce(async (query: string, signal: AbortSignal) => {
        if (!searchValue) return;
        const response = await apiFetch(
          `search/autocomplete?keyword=${query}`,
          {
            signal,
          }
        );

        const data = await response.json();
        setSearchResults(data);
      }, 400),
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => setOpen(true)}
        variant="secondary"
        className="flex h-9! w-xl items-center justify-between px-3 max-lg:hidden"
      >
        <div className="flex items-center gap-2">
          <SearchIcon />
          <span className="text-input-muted text-sm font-normal tracking-normal">
            {!searchValue
              ? `Search products, brands, categories...`
              : searchValue}
          </span>
        </div>
        <kbd className="flex items-center gap-0.5 font-mono text-xs tracking-tighter text-neutral-500">
          CtrlK
        </kbd>
      </Button>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="h-7 w-7 rounded-full! bg-transparent lg:hidden"
      >
        <SearchIcon />
      </Button>
      <CommandDialog className="md:min-w-xl" open={open} onOpenChange={setOpen}>
        <Command>
          <div className="relative">
            <CommandInput
              value={searchValue}
              onValueChange={(value) => {
                setSearchValue(value);
                handleSearch(value);
              }}
              placeholder="Type something to search..."
            />
            <Button
              variant="ghost"
              className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            >
              <Mic className="size-4.5 opacity-80" />
            </Button>
          </div>

          <CommandList className="mt-4">
            <CommandEmpty>No searches found.</CommandEmpty>
            {searchValue && (
              <CommandGroup
                className="border-t border-muted py-2"
                heading={
                  <div className="flex items-center gap-1">
                    <TextSearch className="size-4" />
                    Related Results
                  </div>
                }
              >
                <CommandItem
                  className="group cursor-pointer"
                  value={`search-${searchValue}`}
                  onSelect={() => {
                    setSearchValueToUser(searchValue);
                    setSearchValue(searchValue);
                    setOpen(false);
                  }}
                >
                  {searchValue}
                  <CommandShortcut className="opacity-0 group-focus:opacity-100">
                    <CornerDownLeft className="size-4" />
                  </CommandShortcut>
                </CommandItem>
                {searchResults.map((item, index) => (
                  <CommandItem
                    key={index}
                    className="group cursor-pointer"
                    value={`search-${item}`}
                    onSelect={() => {
                      setOpen(false);
                      setSearchResults([]);
                      setSearchValue(item);
                      setSearchValueToUser(item);
                    }}
                  >
                    {item}
                    <CommandShortcut className="opacity-0 group-hover:opacity-100">
                      <CornerDownLeft className="size-4" />
                    </CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {userSearches.length > 0 && (
              <CommandGroup
                className="border-t border-muted py-2"
                heading={
                  <div className="flex items-center gap-1">
                    <History className="size-4" />
                    Recent Searches
                  </div>
                }
              >
                {userSearches.map((item, index) => (
                  <CommandItem
                    key={index}
                    className="group cursor-pointer"
                    value={`recent-${item}`}
                    onSelect={() => {
                      setOpen(false);
                      setSearchResults([]);
                      setSearchValue(item);
                      setSearchValueToUser(item);
                    }}
                  >
                    {item}
                    <CommandShortcut className="opacity-0 group-hover:opacity-100">
                      <CornerDownLeft className="size-4" />
                    </CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {trendingSearches.length > 0 && (
              <CommandGroup
                className="border-t border-muted py-2"
                heading={
                  <div className="flex items-center gap-1">
                    <TrendingUp className="size-4" />
                    Trendings
                  </div>
                }
              >
                {trendingSearches.map((item, index) => (
                  <CommandItem
                    key={index}
                    className="group cursor-pointer"
                    value={`trending-${item}`}
                    onSelect={() => {
                      setOpen(false);
                      setSearchResults([]);
                      setSearchValue(item);
                      setSearchValueToUser(item);
                    }}
                  >
                    {item}
                    <CommandShortcut className="opacity-0 group-hover:opacity-100">
                      <CornerDownLeft className="size-4" />
                    </CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}
