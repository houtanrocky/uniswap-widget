import { useCallback, useState, useRef } from "react";
import {
  RATE_LIMIT_CONFIG,
  searchTokens as searchTokensCore,
  type TokenInfo,
} from "@uniswap-widget/core";

/**
 * React binding for the core `searchTokens`. Owns debounce, abort lifecycle,
 * and result state; the network request + normalization live in
 * `@uniswap-widget/core`.
 */
export function useTokenSearch() {
  const [searchResults, setSearchResults] = useState<TokenInfo[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Refs to manage debouncing and request cancellation
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentAbortControllerRef = useRef<AbortController | null>(null);

  const searchTokens = useCallback(
    async (query: string): Promise<TokenInfo[]> => {
      // Cancel any existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // Cancel any ongoing request
      if (currentAbortControllerRef.current) {
        currentAbortControllerRef.current.abort();
        currentAbortControllerRef.current = null;
      }

      if (!query.trim()) {
        setSearchResults([]);
        setSearching(false);
        setSearchError(null);
        return [];
      }

      // Set up debounced search using centralized configuration
      return new Promise((resolve) => {
        debounceTimerRef.current = setTimeout(async () => {
          setSearching(true);
          setSearchError(null);

          const abortController = new AbortController();
          currentAbortControllerRef.current = abortController;

          try {
            const results = await searchTokensCore(query, {
              signal: abortController.signal,
              chainIds: [8453], // Base chain only
            });

            if (!abortController.signal.aborted) {
              setSearchResults(results);
              setSearching(false);
            }

            resolve(results);
          } catch (error) {
            // Don't show errors for aborted requests
            if (error instanceof Error && error.name === "AbortError") {
              resolve([]);
              return;
            }

            console.error("Token search error:", error);

            if (!abortController.signal.aborted) {
              setSearchError(
                error instanceof Error ? error.message : "Search failed"
              );
              setSearchResults([]);
              setSearching(false);
            }

            resolve([]);
          } finally {
            if (currentAbortControllerRef.current === abortController) {
              currentAbortControllerRef.current = null;
            }
          }
        }, RATE_LIMIT_CONFIG.SEARCH_DEBOUNCE);
      });
    },
    []
  );

  const clearSearch = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    if (currentAbortControllerRef.current) {
      currentAbortControllerRef.current.abort();
      currentAbortControllerRef.current = null;
    }

    setSearchResults([]);
    setSearchError(null);
    setSearching(false);
  }, []);

  return {
    searchTokens,
    searchResults,
    searching,
    searchError,
    clearSearch,
  };
}
