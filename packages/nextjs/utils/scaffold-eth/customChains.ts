import { defineChain, Hex } from "viem";

export const virtual_mainnet = defineChain({
  id: 1,
  name: 'Virtual Mainnet',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['wss://virtual.mainnet.rpc.tenderly.co/6a7f5674-4952-4e99-97e3-a34c1925a615'] }
  },
  blockExplorers: {
    default: {
      name: 'Tenderly Explorer',
      url: 'https://virtual.mainnet.rpc.tenderly.co/cc490e44-5d2b-45f9-a670-48f3689cd6a5'
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