"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  SearchIcon,
  TextSearch,
  TrendingUp,
  X,
} from "lucide-react";
import { apiFetch, debounce } from "@/lib/utils";
import { useAppStore } from "@/store/store";

interface UserSearchResponse {
  searchId: string;
  searchText: string;
  searchedAt: string;
}

export function Search() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);

  const userId = useAppStore((state) => state.userId);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname !== "/search") return;

    const query = searchParams.get("query")?.trim() ?? "";

    (() => {
      if (!query) {
        setSearchValue("");
        setSearchResults([]);
        return;
      }

      setSearchValue(query);
    })();
  }, [searchParams, pathname]);

  const { data: userSearches = [] } = useQuery<string[]>({
    queryKey: ["user-searches", userId],
    queryFn: async () => {
      if (!userId) return [];

      const response = await apiFetch(`search/recent/${userId}`);

      if (!response.ok) {
        throw new Error("Unable to fetch user recent searches");
      }

      const data: UserSearchResponse[] = await response.json();

      return data.map((item) => item.searchText);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: trendingSearches = [] } = useQuery<string[]>({
    queryKey: ["trending-searches"],
    queryFn: async () => {
      const response = await fetch("/backend/search/trending");

      if (!response.ok) {
        throw new Error("Unable to fetch trending searches");
      }

      const data = await response.json();

      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", down);

    return () => {
      window.removeEventListener("keydown", down);
    };
  }, []);

  useEffect(() => {
    if (!searchValue.trim()) {
      (() => setSearchResults([]))();
    }
  }, [searchValue]);

  const handleSearch = useMemo(
    () =>
      debounce(async (query: string, signal: AbortSignal) => {
        if (!query.trim()) {
          setSearchResults([]);
          return;
        }

        const response = await apiFetch(
          `search/autocomplete?keyword=${encodeURIComponent(query)}`,
          {
            signal,
          }
        );

        if (!response.ok) {
          setSearchResults([]);
          return;
        }

        const data = await response.json();

        setSearchResults(data ?? []);
      }, 400),
    []
  );

  const navigateToSearch = async (value: string) => {
    const query = value.trim();
    if (!query) return;

    setSearchValue(query);
    setSearchResults([]);
    setOpen(false);

    router.push(`/search?query=${encodeURIComponent(query)}`);
  };

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    handleSearch(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => setOpen(true)}
        variant="secondary"
        className="flex h-9! w-md items-center justify-between px-3 max-lg:hidden xl:w-xl"
      >
        <div className="flex items-center gap-2">
          <SearchIcon />

          <span className="text-input-muted text-sm font-normal tracking-normal">
            {!searchValue
              ? "Search products, brands, categories..."
              : searchValue}
          </span>
        </div>

        <kbd className="flex items-center gap-0.5 font-mono text-xs tracking-tighter text-neutral-500">
          CtrlK
        </kbd>
      </Button>

      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="icon"
        className="rounded-full! bg-transparent lg:hidden"
      >
        <SearchIcon className="size-4 opacity-60" />
      </Button>

      <CommandDialog
        className="top-14 md:min-w-2xl"
        open={open}
        onOpenChange={setOpen}
      >
        <Command>
          <div className="relative">
            <CommandInput
              value={searchValue}
              onValueChange={handleInputChange}
              placeholder="Type something to search..."
            />

            {searchValue && (
              <Button
                variant="ghost"
                className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
                onClick={() => {
                  setSearchValue("");
                  setSearchResults([]);
                }}
              >
                <X className="size-4.5 opacity-80" />
              </Button>
            )}
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
                    navigateToSearch(searchValue);
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
                      navigateToSearch(item);
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
                      navigateToSearch(item);
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
                    Trending
                  </div>
                }
              >
                {trendingSearches.map((item, index) => (
                  <CommandItem
                    key={index}
                    className="group cursor-pointer"
                    value={`trending-${item}`}
                    onSelect={() => {
                      navigateToSearch(item);
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
