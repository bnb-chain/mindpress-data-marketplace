import { useEffect, useState } from 'react';
import { parseAbi } from 'viem';
import { useNetwork, usePublicClient } from 'wagmi';
import { BSC_CHAIN, NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';

export const useRelayFee = () => {
  const [relayFee, setRelayFee] = useState(BigInt(0));
  const publicClient = usePublicClient();
  const { chain } = useNetwork();

  useEffect(() => {
    getFee();

    async function getFee() {
      if (chain?.id !== BSC_CHAIN.id) return;

      const tmp = await publicClient.readContract({
        abi: parseAbi([
          'function getMinRelayFee() external view returns (uint256 amount)',
        ]),
        address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        functionName: 'getMinRelayFee',
      });
      setRelayFee(tmp);
    }
  }, [chain?.id, publicClient]);

  return { relayFee };
};
