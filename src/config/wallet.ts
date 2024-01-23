import { WagmiConfig, createConfig } from 'wagmi';
import {
  WalletKitButton,
  WalletKitProvider,
  getDefaultConfig,
  WalletKitOptions,
  SwitchNetworkModal,
  rgba,
} from '@node-real/walletkit';
import {
  metaMask,
  trustWallet,
  walletConnect,
} from '@node-real/walletkit/wallets';
import * as env from '../env';
import { Chain, bsc, bscTestnet } from 'viem/chains';
export const bscChain = env.NETWORK === 'Mainnet' ? bsc : bscTestnet;

export const chains: Chain[] = [
  bscChain,
  {
    id: env.GF_CHAIN_ID,
    network: 'greenfield',
    rpcUrls: {
      default: {
        http: [env.GF_RPC_URL],
      },
      public: {
        http: [env.GF_RPC_URL],
      },
    },
    name: `Greenfield ${env.NETWORK}`,
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
  },
];

export const config = createConfig(
  getDefaultConfig({
    autoConnect: true,
    appName: 'MindPress',

    // WalletConnect 2.0 requires a projectId which you can create quickly
    // and easily for free over at WalletConnect Cloud https://cloud.walletconnect.com/sign-in
    walletConnectProjectId: '80adccc73d399805828036182bf2e594',

    chains,
    connectors: [trustWallet(), metaMask(), walletConnect()],
  }),
);

export const options: WalletKitOptions = {
  initialChainId: bscChain.id,
};
