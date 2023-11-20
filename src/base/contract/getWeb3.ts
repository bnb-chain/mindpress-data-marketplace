import Web3 from 'web3';
import { BSC_RPC_URL } from '../../env';

export const getWeb3 = (sign = true) => {
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

  return web3;
};
