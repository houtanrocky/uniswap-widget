import { Currency, Token } from "@uniswap/sdk-core";
import { ethers } from "ethers";
import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import {
  ERC20_ABI,
  RATE_LIMIT_CONFIG,
  makeProviderRequest,
  toReadableAmount,
  type SwapState,
  type TokenInfo,
} from "@uniswap-widget/core";

const tokenInfoToToken = (info: TokenInfo): Token => 
  new Token(info.chainId, info.address, info.decimals, info.symbol, info.name);

export default function useBalances({
  state,
  setState,
}: {
  state: SwapState;
  setState: React.Dispatch<React.SetStateAction<SwapState>>;
}) {
  const { address } = useAccount();
  const lastFetchRef = useRef<string>("");

  async function getCurrencyBalance(
    chainId: number,
    userAddress: string,
    currency: Currency
  ): Promise<string> {
    if (currency.isNative || currency.symbol === "WMATIC") {
      return makeProviderRequest(
        chainId,
        `balance-native-${userAddress}`,
        async (provider) => {
          const balance = await provider.getBalance(userAddress);
          return Number(ethers.utils.formatEther(balance)).toFixed(3);
    }
      );
    }

    return makeProviderRequest(
      chainId,
      `balance-erc20-${currency.address}-${userAddress}`,
      async (provider) => {
    const ERC20Contract = new ethers.Contract(
      currency.address,
      ERC20_ABI,
      provider
    );
        const [balance, decimals] = await Promise.all([
          ERC20Contract.balanceOf(userAddress),
          ERC20Contract.decimals(),
        ]);
    return toReadableAmount(balance, decimals);
      }
    );
  }

  const refreshBalances = async () => {
    if (!address) {
      return;
    }
    if (!state.inputToken || !state.outputToken) {
      return;
    }

    // Create a unique key for this balance fetch to avoid duplicate calls
    const fetchKey = `${address}-${state.inputToken.address}-${state.outputToken.address}`;
    if (lastFetchRef.current === fetchKey) {
      return; // Skip if we just fetched the same balances
    }
    lastFetchRef.current = fetchKey;

    setState((prev) => ({ ...prev, balancesLoading: true }));

    try {
      // Fetch both balances in parallel with rate limiting
      const [balanceIn, balanceOut] = await Promise.all([
        getCurrencyBalance(
          state.inputToken.chainId,
          address,
          tokenInfoToToken(state.inputToken)
        ),
        getCurrencyBalance(
          state.outputToken.chainId,
          address,
          tokenInfoToToken(state.outputToken)
        ),
      ]);

    setState((prev) => ({
      ...prev,
      balanceIn,
        balanceOut,
        balancesLoading: false,
    }));
    } catch (error) {
      console.error("Error fetching balances:", error);
    setState((prev) => ({
      ...prev,
        balanceIn: "0.000",
        balanceOut: "0.000", 
        balancesLoading: false,
    }));
    }
  };

  useEffect(() => {
    if (address) {
      // Use centralized debounce configuration
      const timeoutId = setTimeout(refreshBalances, RATE_LIMIT_CONFIG.BALANCE_DEBOUNCE);
      return () => clearTimeout(timeoutId);
    }
  }, [address, state.inputToken?.address, state.outputToken?.address]);

  return { refreshBalances };
}
