import { WalletKitOptions, getDefaultConfig } from '@node-real/walletkit';
import {
  metaMask,
  trustWallet,
  walletConnect,
} from '@node-real/walletkit/wallets';
import { Chain } from 'viem/chains';
import { createConfig } from 'wagmi';
import * as env from '../env';

export const chains: Chain[] = [env.BSC_CHAIN];

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
  initialChainId: env.BSC_CHAIN.id,
};
