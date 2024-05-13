import { IReturnOffChainAuthKeyPairAndUpload } from '@bnb-chain/greenfield-js-sdk';
import { GF_CHAIN_ID } from '../../env';
import { client } from '../gfSDK';

const isEmpty = (obj: object) => {
  return Object.keys(obj).length === 0;
};
const GREENFIELD_CHAIN_ID = GF_CHAIN_ID;

export const getGAOptions = (name: string) => {
  const options: Record<string, string> = {
    MetaMask: 'dc.walletconnect.modal.metamak.click',
    'Trust Wallet': 'dc.walletconnect.modal.trustwallet.click',
  };

  return options[name];
};

export const getGNFDChainId = () => {
  return GREENFIELD_CHAIN_ID;
};

type Path = {
  id: number;
  name: string;
  type: 'OBJECT' | 'COLLECTION';
};
export const encodePath = (path: Path[]) => {
  return btoa(JSON.stringify(path));
};
export const decodePath = (encodedPath: string): Path[] => {
  return JSON.parse(atob(encodedPath)) as Path[];
};

export const checkURL = (url: string) => {
  const reg =
    /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
  return reg.test(url);
};

export const getSps = async () => {
  const sps = await client.sp.getStorageProviders();
  const finalSps = (sps ?? []).filter((v: any) => {
    return v.endpoint.includes('nodereal') || v.endpoint.includes('bnbchain');
  });

  return finalSps;
};

export const getAllSps = async () => {
  const sps = await getSps();

  return sps.map((sp) => {
    return {
      address: sp.operatorAddress,
      endpoint: sp.endpoint,
      name: sp.description?.moniker,
    };
  });
};

export const getOffchainAuthKeys = async (address: string, provider: any) => {
  const storageResStr = localStorage.getItem(address);

  if (storageResStr) {
    const storageRes = JSON.parse(
      storageResStr,
    ) as IReturnOffChainAuthKeyPairAndUpload;
    if (storageRes.expirationTime < Date.now()) {
      alert('Your auth key has expired, please generate a new one');
      localStorage.removeItem(address);
      return;
    }

    return storageRes;
  }

  const allSps = await getAllSps();
  console.log({
    sps: allSps,
    chainId: GREENFIELD_CHAIN_ID,
    expirationMs: 5 * 24 * 60 * 60 * 1000,
    domain: window.location.origin,
    address,
  });
  const offchainAuthRes =
    await client.offchainauth.genOffChainAuthKeyPairAndUpload(
      {
        sps: allSps,
        chainId: GREENFIELD_CHAIN_ID,
        expirationMs: 5 * 24 * 60 * 60 * 1000,
        domain: window.location.origin,
        address,
      },
      provider,
    );

  const { code, body: offChainData } = offchainAuthRes;
  if (code !== 0 || !offChainData) {
    throw offchainAuthRes;
  }

  localStorage.setItem(address, JSON.stringify(offChainData));
  return offChainData;
};
