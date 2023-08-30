"use client";
import { getSupabaseClient } from "@/app/api/sdk";
import { useLocalStorage } from "@/hooks/use-localstorage";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const ShopifyFetcher = () => {
  const [store, setStore] = useState("");

  const train = async () => {
    toast.promise(
      fetch("/api/store", { body: JSON.stringify({ store }), method: "POST" }).then(async res => {
        if (!res.ok) {
          const ee = await res.json();

          throw new Error(ee.error);
        }

        console.log(await res.json());
      }),
      {
        loading:
          "Training ai with dataset (this usually takes a while depending on the volume of data to be processed)",
        success: "Training complete",
        error: error => error.message || "Error while training data",
      }
    );
  };

  return (
    <div className="space-y-4 px-5">
      <div className="space-y-3">
        <Label htmlFor="store">Enter Shopify store name</Label>
        <Input id="store" value={store} placeholder="Ex. allbirds.com" onChange={e => setStore(e.target.value)} />
      </div>

      <Button onClick={train} disabled={!isValidUrl(store)}>
        Fetch Product from store
      </Button>
    </div>
  );
};

export default ShopifyFetcher;

const isValidUrl = urlString => {
  var urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator
  return !!urlPattern.test(urlString);
};

export const StoreSelector = () => {
  const [selectedStore, setSelectedStore] = useLocalStorage<string>("selectedStore", "None");
  const [open, setOpen] = useState(false);
  const [stores, setStores] = useState(["None"]);
  const [isMounted, setIsMounted] = useState(false);
  const supabase = getSupabaseClient();

  const fetchData = useCallback(async () => {
    const { error, data } = await supabase.from("distinct_stores").select();
    if (error) {
      console.log(error);
    }

    setStores(["None", ...data.map(d => d.brand).filter(d => d.length > 2)]);
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className="w-full justify-between"
        >
          {selectedStore || "Select a store..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[250px] p-0">
        <Command loop>
          <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
            <CommandInput placeholder="Select Store..." />
            <CommandEmpty>No stores found.</CommandEmpty>

            <CommandGroup heading="Available stores">
              {stores.map(store => (
                <CommandItem
                  key={store}
                  onSelect={() => {
                    setSelectedStore(store);
                    setOpen(false);
                  }}
                >
                  {store}
                  <CheckIcon className={cn("ml-auto h-4 w-4", selectedStore === store ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
