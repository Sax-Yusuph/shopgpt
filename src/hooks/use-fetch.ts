import { useEffect, useState } from "react";

/* H/T: 
  Avoiding Race Conditions and Memory Leaks in React useEffect
  https://javascript.plainenglish.io/avoiding-race-conditions-and-memory-leaks-in-react-useeffect-2034b8a0a3c7
*/

interface IUseFetchWithAbortResponse {
  imageUrl: string;
  isLoading: boolean;
  error: Error | null;
}

export const useFetchWithAbort = (endpoint: string, id: string, options?: ResponseInit): IUseFetchWithAbortResponse => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchedData, setFetchedData] = useState("");

  useEffect(() => {
    let abortController = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(endpoint, {
          ...options,
          signal: abortController.signal,
        });
        const newData = await response.blob();
        setIsLoading(false);
        const url = URL.createObjectURL(newData);
        setFetchedData(url);
      } catch (error) {
        if (error.name === "AbortError") {
          setError(error);
          setIsLoading(false);
        }
      }
    };
    fetchData();
    return () => {
      abortController.abort();
    };
  }, [endpoint, id, options]);

  return { imageUrl: fetchedData, isLoading, error };
};
