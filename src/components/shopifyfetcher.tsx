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

  return (
    <div className="space-y-4 px-5">
      <div className="space-y-3">
        <Label htmlFor="store">Enter Shopify store name</Label>
        <Input id="store" value={store} placeholder="Ex. allbirds.com" onChange={e => setStore(e.target.value)} />
      </div>
      <div className="space-y-3">
        <Label htmlFor="store">Page number</Label>
        <Input type="number" value={page} onChange={e => setPage(+e.target.value)} min="1" />
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
