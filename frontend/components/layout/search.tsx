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
} from "@/components/ui/command";
import { History, SearchIcon, TextSearch, TrendingUp } from "lucide-react";
import { apiFetch, debounce } from "@/lib/utils";
import { useAppStore } from "@/store/store";

export function Search() {

  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [userSearches, setUserSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const userId = useAppStore(state => state.userId);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setOpen(true);
      }
    }

    window.addEventListener("keydown", down);

    return () =>
      window.removeEventListener("keydown", down)

  }, []);

  useEffect(() => {
    if (!searchValue.trim()) {
      setSearchResults([]);
    }
  }, [searchValue]);

  const setSearchValueToUser = async (value: string) => {
    if (!userId && !searchValue) return;

    await apiFetch(`search?query=${value}&userId=${userId}`, {
      headers: {
        "Content-Type": "application/json",
      }
    });

    getUserSearches();
  }

  async function getUserSearches() {

    if (!userId) return;

    const response = await apiFetch(`search/recent/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data) {
      const searchData = data.map((item: any) => item.searchText);
      setUserSearches(searchData);
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
      const data = await response.json();

      if (data) setTrendingSearches(data);
      else setTrendingSearches([]);
    }
    getTrendingSearches();
  }, [])

  // handle search here
  const handleSearch = useMemo(() => debounce(async (query: string, signal: AbortSignal) => {
    if (!searchValue) return;
    const response = await apiFetch(`search/autocomplete?keyword=${query}`, {
      signal,
    });

    const data = await response.json();
    setSearchResults(data);
  }, 400), []);

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={() => setOpen(true)}
        variant="secondary"
        className="flex h-9! w-xl items-center justify-between px-3 max-lg:hidden"
      >
        <div className="flex items-center gap-2">
          <SearchIcon />
          <span className="text-sm font-normal tracking-normal text-input-muted">
            {!searchValue ? `Search products, brands, categories...` : searchValue}
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
          <CommandInput
            className="h-12"
            value={searchValue}
            onValueChange={(value) => {
              setSearchValue(value);
              handleSearch(value);
            }}
            placeholder="Type something to search..."
          />

          <CommandList className="mt-4">
            {
              searchValue &&
              <CommandGroup className="py-2 border-t border-muted" heading={
                <div className="flex items-center gap-1">
                  <TextSearch className="size-4" />
                  Related Results
                </div>
              }>
                <CommandItem
                  className="cursor-pointer"
                  value={`search-${searchValue}`}
                  onSelect={() => {
                    setSearchValueToUser(searchValue);
                    setSearchValue(searchValue);
                    setOpen(false);
                  }
                  }>
                  {searchValue}
                </CommandItem>
                {
                  searchResults.map((item, index) =>
                    <CommandItem
                      key={index}
                      className="cursor-pointer"
                      value={`search-${item}`}
                      onSelect={() => {
                        setOpen(false);
                        setSearchResults([]);
                        setSearchValue(item);
                        setSearchValueToUser(item)
                      }}>
                      {item}
                    </CommandItem>
                  )
                }
              </CommandGroup>
            }
            {
              userSearches.length > 0 &&
              <CommandGroup
                className="py-2 border-t border-muted"
                heading={
                  <div className="flex items-center gap-1">
                    <History className="size-4" />
                    Recent Searches
                  </div>
                }>
                {
                  userSearches.map((item, index) =>
                    <CommandItem
                      key={index}
                      className="cursor-pointer"
                      value={`recent-${item}`}
                      onSelect={() => {
                        setOpen(false);
                        setSearchResults([]);
                        setSearchValue(item);
                        setSearchValueToUser(item)
                      }}>
                      {item}
                    </CommandItem>)
                }
              </CommandGroup>
            }
            {
              trendingSearches.length > 0 &&
              <CommandGroup
                className="py-2 border-t border-muted"
                heading={
                  <div className="flex items-center gap-1">
                    <TrendingUp className="size-4 " />
                    Trendings
                  </div>
                }>
                {
                  trendingSearches.map((item, index) =>
                    <CommandItem
                      key={index}
                      className="cursor-pointer"
                      value={`trending-${item}`}
                      onSelect={() => {
                        setOpen(false);
                        setSearchResults([]);
                        setSearchValue(item);
                        setSearchValueToUser(item)
                      }}>
                      {item}
                    </CommandItem>)
                }
              </CommandGroup>
            }
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}