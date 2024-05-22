import { bsc, bscTestnet } from 'viem/chains';

const {
  REACT_APP_GF_CHAIN_ID,
  REACT_APP_GF_RPC_URL,
  REACT_APP_BSC_RPC_URL,
  REACT_APP_BSC_CHAIN_ID,
  REACT_APP_NEW_MARKETPLACE_CONTRACT_ADDRESS,
  REACT_APP_GF_EXPLORER_URL,
  REACT_APP_BSC_EXPLORER_URL,
  REACT_APP_DCELLAR_URL,
  REACT_APP_DAPP_NAME,
  REACT_APP_NETWORK,
  REACT_APP_API_DOMAIN,
  REACT_APP_NET_ENV,
  REACT_APP_UPLOAD_OBJECT_FEE,
} = process.env;

type NET = 'TESTNET' | 'MAINNET';
export const NET_ENV: NET = REACT_APP_NET_ENV as NET;

export const GF_CHAIN_ID = Number(REACT_APP_GF_CHAIN_ID);
export const GF_RPC_URL = REACT_APP_GF_RPC_URL as string;
export const BSC_RPC_URL = REACT_APP_BSC_RPC_URL as string;
export const BSC_CHAIN_ID = Number(REACT_APP_BSC_CHAIN_ID);

export const NEW_MARKETPLACE_CONTRACT_ADDRESS =
  REACT_APP_NEW_MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`;

export const GF_EXPLORER_URL = REACT_APP_GF_EXPLORER_URL;
export const BSC_EXPLORER_URL = REACT_APP_BSC_EXPLORER_URL;
export const DCELLAR_URL = REACT_APP_DCELLAR_URL;

export const DAPP_NAME = REACT_APP_DAPP_NAME;

export const NETWORK = REACT_APP_NETWORK;

export const API_DOMAIN = REACT_APP_API_DOMAIN;

export const UPLOAD_OBJECT_FEE = REACT_APP_UPLOAD_OBJECT_FEE;

export const BSC_CHAIN = NET_ENV === 'TESTNET' ? bscTestnet : bsc;

export const GREENFIELD_CHAIN = {
  id: GF_CHAIN_ID,
  network: 'greenfield',
  rpcUrls: {
    default: {
      http: [GF_RPC_URL],
    },
    public: {
      http: [GF_RPC_URL],
    },
  },
  name: `Greenfield ${NETWORK}`,
  nativeCurrency: {
    name: 'tBNB',
    symbol: 'tBNB',
    decimals: 18,
  },
  testnet: NET_ENV === 'TESTNET',
};
