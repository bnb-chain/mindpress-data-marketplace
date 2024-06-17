import { useSetAtom } from 'jotai';
import { Address, Connector, useAccount } from 'wagmi';
import { offchainDataAtom } from '../atoms/offchainDataAtomAtom';
import { getOffchainAuthKeys } from '../utils/off-chain-auth/utils';

export const useOffchainAuth = () => {
  const { connector: cc, address: aa } = useAccount();
  const setOffchainData = useSetAtom(offchainDataAtom);

  const applyOffchainAuthData = async ({
    connector = cc,
    address = aa,
  }: {
    connector?: Connector;
    address?: Address;
  }) => {
    const provider = await connector?.getProvider();
    // console.log('provider', provider);
    const offChainData = await getOffchainAuthKeys(
      address as Address,
      provider,
    );
    // console.log('useAccount offChainData', offChainData);
    setOffchainData({
      address: address!,
      seed: offChainData?.seedString,
    });
  };

  return {
    applyOffchainAuthData,
  };
};
