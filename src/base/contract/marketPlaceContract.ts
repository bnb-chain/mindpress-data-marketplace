// import { useGetChainProviders } from './useGetChainProviders';
import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { BSC_RPC_URL, NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';
import ABI from './marketplace_abi.json';

export const MarketPlaceContract = (sign = true) => {
  // const gfProvider = new Web3.providers.HttpProvider(BSC_RPC_URL);
  let isTrustWallet = '';
  try {
    isTrustWallet = JSON.parse(localStorage.getItem('wagmi.wallet') || '');
  } catch (e) {}

  let web3;
  if (sign) {
    web3 = new Web3(
      isTrustWallet === 'injected'
        ? (window.trustWallet as any)
        : (window.ethereum as any),
    );
  } else {
    const gfProvider = new Web3.providers.HttpProvider(BSC_RPC_URL);
    web3 = new Web3(gfProvider);
  }

  const contractInstance = new web3.eth.Contract(
    ABI as AbiItem[],
    NEW_MARKETPLACE_CONTRACT_ADDRESS,
  );
  return contractInstance;
};
