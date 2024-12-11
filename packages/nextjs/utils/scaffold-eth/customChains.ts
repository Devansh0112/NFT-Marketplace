import { defineChain, Hex } from "viem";

export const virtual_optimistic_ethereum = defineChain({
  id: 10,
  name: 'Virtual Optimistic Ethereum',
  nativeCurrency: { name: 'VETH', symbol: 'vETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://virtual.optimism.rpc.tenderly.co/ca6a1903-42bb-48cb-a41e-bd827a98a90d'] }
  },
  blockExplorers: {
    default: {
      name: 'Tenderly Explorer',
      url: 'https://virtual.optimism.rpc.tenderly.co/d63c9bd8-9d47-4cfe-8389-9e9659342b86'
    }
  },
});

export type TSetBalanceRpc = {
  method: "tenderly_setBalance",
  Parameters: [addresses: Hex[], value: Hex],
  ReturnType: Hex
}

export type TSetErc20BalanceRpc = {
  method: "tenderly_setErc20Balance",
  Parameters: [erc20: Hex, to: Hex, value: Hex],
  ReturnType: Hex
}