import React, { useState, useEffect, useMemo } from "react";
import { Token } from "@uniswap/sdk-core";
import { TokenInfo, TokenWithInfo, TokenListType } from "@uniswap-widget/core";
import { useTokenSearch } from "../hooks/useTokenSearch";

interface TokenListProps {
  tokens: TokenInfo[];
  onSelect: (tokenWithInfo: TokenWithInfo) => void;
  onClose: () => void;
  listType: TokenListType; // 'sell' or 'buy'
}

export const TokenList: React.FC<TokenListProps> = ({
  tokens,
  onSelect,
  onClose,
  listType,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { searchTokens, searchResults, searching, searchError, clearSearch } = useTokenSearch();

  // Trigger search when query changes (debouncing handled in hook)
  useEffect(() => {
    if (searchQuery.trim()) {
      searchTokens(searchQuery);
    } else {
      clearSearch();
    }
  }, [searchQuery, searchTokens, clearSearch]);

  // Combine local tokens with search results, prioritizing local tokens
  const displayTokens = useMemo(() => {
    if (!searchQuery.trim()) {
      return tokens; // Show list-specific tokens when no search
    }

    // Filter local tokens first (from the specific list)
    const filteredLocalTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase() === searchQuery.toLowerCase()
  );

    // If we have local matches, show them first
    if (filteredLocalTokens.length > 0) {
      // Add unique search results that aren't already in local tokens
      const localAddresses = new Set(filteredLocalTokens.map(t => t.address.toLowerCase()));
      const uniqueSearchResults = searchResults.filter(
        token => !localAddresses.has(token.address.toLowerCase())
      );
      return [...filteredLocalTokens, ...uniqueSearchResults];
    }

    // If no local matches, show search results
    return searchResults;
  }, [tokens, searchQuery, searchResults]);

  const listTitle = listType === 'sell' ? 'Select token to sell' : 'Select token to buy';

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
      <div className="p-4">
        <div className="text-sm font-medium text-gray-700 mb-2">{listTitle}</div>
        <input
          type="text"
          placeholder="Search token name or paste address"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {searching && (
          <div className="text-sm text-gray-500 mt-2">Searching...</div>
        )}
        {searchError && (
          <div className="text-sm text-red-500 mt-2">Search error: {searchError}</div>
        )}
      </div>
      <div className="divide-y">
        {displayTokens.length === 0 && searchQuery.trim() && !searching ? (
          <div className="p-4 text-gray-500 text-center">
            No tokens found for "{searchQuery}"
          </div>
        ) : (
          displayTokens.map((tokenInfo) => {
            // Use logoUrl first, fallback to logoURI for compatibility
            const logoSrc = tokenInfo.logoUrl || tokenInfo.logoURI;
            
            return (
          <button
                key={tokenInfo.address}
            className="w-full p-4 text-left hover:bg-gray-50 flex items-center"
            onClick={() => {
                  const token = new Token(
                    tokenInfo.chainId,
                    tokenInfo.address,
                    tokenInfo.decimals,
                    tokenInfo.symbol,
                    tokenInfo.name
                  );
                  
                  onSelect({
                    token,
                    info: tokenInfo
                  });
              onClose();
            }}
          >
                {logoSrc && (
              <div className="relative h-[24px] me-5">
                <img
                      src={logoSrc}
                      alt={tokenInfo.symbol}
                      className="h-[24px] w-[24px] rounded-full"
                      onError={(e) => {
                        // Hide broken images
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                />
              </div>
            )}
            <div>
              <div className="font-medium">
                    {tokenInfo.symbol === "WMATIC" ? "POL" : tokenInfo.symbol}
                  </div>
                  <div className="text-sm text-gray-500">{tokenInfo.name}</div>
                  <div className="text-xs text-gray-400">{tokenInfo.address}</div>
                  {tokenInfo.isSpam === "TRUE" && (
                    <div className="text-xs text-red-500 mt-1">
                      ⚠️ Warning: This token has been marked as spam
                    </div>
                  )}
                  {tokenInfo.safetyLevel === "STRONG_WARNING" && (
                    <div className="text-xs text-orange-500 mt-1">
                      ⚠️ Exercise caution with this token
              </div>
                  )}
            </div>
          </button>
            );
          })
        )}
      </div>
    </div>
  );
};
