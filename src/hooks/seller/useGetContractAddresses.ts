import { Address, createPublicClient, http } from 'viem';
import { BSC_CHAIN, NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';
import { useQuery } from '@tanstack/react-query';
import { MarketplaceAbi } from '../../base/contract/marketplace.abi';

export const useGetContractAddresses = () => {
  const publicClient = createPublicClient({
    transport: http(),
    chain: BSC_CHAIN,
  });

  return useQuery({
    queryKey: ['GET_CONTRACT_ADDRESSES'],
    queryFn: async () => {
      const contract = {
        address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        abi: MarketplaceAbi,
      };

      const contractAddresses = await publicClient.multicall({
        contracts: [
          {
            ...contract,
            functionName: '_CROSS_CHAIN',
          },
          {
            ...contract,
            functionName: '_BUCKET_HUB',
          },
        ],
      });

      console.log('contractAddresses res: ', contractAddresses);
      return {
        CrossChainAddress: (contractAddresses[0].result || '0x') as Address,
        BucketHubAddress: (contractAddresses[1].result || '0x') as Address,
      };
    },
    staleTime: Infinity,
    // throwOnError: () => {},
    // gcTime: Infinity,
  });
};
