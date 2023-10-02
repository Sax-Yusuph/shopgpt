"use client";
import { getSupabaseClient } from "@/app/api/sdk";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STORAGE, cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useLocalStorageState } from "ahooks";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";

const ShopifyFetcher = () => {
  const [store, setStore] = useState("");

  const train = async () => {
    toast.promise(
      fetch("/api/store", { body: JSON.stringify({ store }), method: "POST" }).then(async res => {
        if (!res.ok) {
          const ee = await res.json();

          throw new Error(ee.error);
        }
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
        <Input
          autoFocus={false}
          id="store"
          value={store}
          placeholder="Ex. allbirds.com"
          onChange={e => setStore(e.target.value)}
        />
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

export const StoreSelector = ({ onSelect }: { onSelect(s: string): void }) => {
  const [selectedStore, setSelectedStore] = useLocalStorageState<string>("selectedStore", { defaultValue: "None" });
  const [open, setOpen] = useState(false);
  const [stores, setStores] = useState(["None"]);
  const [isMounted, setIsMounted] = useState(false);
  const supabase = getSupabaseClient();

  const fetchData = useCallback(async () => {
    const { error, data = [] } = await supabase.from("distinct_stores").select();
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
    <div className="space-y-4 flex-1">
      <Label htmlFor="store">Choose Store</Label>
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
            <CommandList>
              <CommandInput placeholder="Select Store..." />
              <CommandEmpty>No stores found.</CommandEmpty>

              <CommandGroup heading="Available stores">
                {stores.map(store => (
                  <CommandItem
                    key={store}
                    onSelect={() => {
                      setSelectedStore(store);
                      onSelect(store);
                      setOpen(false);
                    }}
                  >
                    {store}
                    <CheckIcon
                      className={cn("ml-auto h-4 w-4", selectedStore === store ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const StorePreference = () => {
  const [preftext, setPreferenceText] = useLocalStorageState(STORAGE.PREFFERED_STORE_PROMPT, {
    defaultValue: "i want only products from {{preferred_store}} store",
  });

  const onSelect = (store: string) => {};

  return (
    <div className="space-y-4 px-5 mt-5">
      <div className="flex justify-between items-center gap-5">
        <StoreSelector onSelect={onSelect} />
        <ModelSelector />
      </div>

      <div className="space-y-4">
        <Label className="mt-2">Preferred store prompt </Label>
        <Textarea value={preftext} onChange={e => setPreferenceText(e.target.value)} rows={2} />
      </div>
    </div>
  );
};

export function ModelSelector() {
  const [model, setModel] = useLocalStorageState(STORAGE.LLM_MODEL, {
    defaultValue: "gpt-3.5-turbo-16k",
  });

  return (
    <div className="space-y-4 flex-1">
      <Label htmlFor="store">Select a Model</Label>

      <Select value={model} onValueChange={setModel}>
        <SelectTrigger>
          <SelectValue placeholder="Select Model" className="text-clip" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="gpt-4">GPT-4</SelectItem>
          <SelectItem value="gpt-3.5-turbo">GPT-3.5-turbo</SelectItem>
          <SelectItem value="gpt-3.5-turbo-0301">GPT-3.5-turbo-0301</SelectItem>
          <SelectItem value="gpt-3.5-turbo-16k">GPT-3.5-turbo-16k</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
