import { useEffect, useState } from 'react';
import { parseAbi } from 'viem';
import { usePublicClient } from 'wagmi';
import { NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../env';

export const useRelayFee = () => {
  const [relayFee, setRelayFee] = useState(BigInt(0));
  const publicClient = usePublicClient();

  useEffect(() => {
    getFee();
    async function getFee() {
      const tmp = await publicClient.readContract({
        // abi: MarketplaceAbi,
        abi: parseAbi([
          'function getMinRelayFee() external view returns (uint256 amount)',
        ]),
        address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        functionName: 'getMinRelayFee',
      });
      setRelayFee(tmp);
    }
    // MarketPlaceContract(false)
    //   .methods.getMinRelayFee()
    //   .call()
    //   .then((result: any) => {
    //     setRelayFee(result);
    //   });
  }, [publicClient]);

  return { relayFee };
};
