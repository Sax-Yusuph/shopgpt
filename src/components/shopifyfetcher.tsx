"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const ShopifyFetcher = () => {
  const [store, setStore] = useState("");
  const [page, setPage] = useState(1);

  const train = async () => {
    toast.promise(
      fetch("/api/store", { body: JSON.stringify({ store, page }), method: "POST" }).then(async res => {
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

  const validate = () => {
    if (!store.includes(".com")) {
      return true;
    }

    return store.length < 5;
  };
  return (
    <div className="space-y-3 px-5">
      <Label htmlFor="store">Enter Shopify store name</Label>
      <Input id="store" value={store} placeholder="Ex. allbirds.com" onChange={e => setStore(e.target.value)} />
      <Input type="number" value={page} onChange={e => setPage(+e.target.value)} min="1" />
      <Button onClick={train} disabled={validate()}>
        Fetch Product from store
      </Button>
    </div>
  );
};

export default ShopifyFetcher;
