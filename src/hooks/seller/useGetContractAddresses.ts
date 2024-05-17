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
          {
            ...contract,
            functionName: '_PERMISSION_HUB',
          },
          {
            ...contract,
            functionName: '_GROUP_TOKEN',
          },
          {
            ...contract,
            functionName: '_GROUP_HUB',
          },
          {
            ...contract,
            functionName: '_MULTI_MESSAGE',
          },
          {
            ...contract,
            functionName: '_MEMBER_TOKEN',
          },
        ],
      });

      console.log('contractAddresses res: ', contractAddresses);
      return {
        CrossChainAddress: (contractAddresses[0].result || '0x') as Address,
        BucketHubAddress: (contractAddresses[1].result || '0x') as Address,
        PermissionHubAddress: (contractAddresses[2].result || '0x') as Address,
        GroupTokenAddress: (contractAddresses[3].result || '0x') as Address,
        GroupHubAddress: (contractAddresses[4].result || '0x') as Address,
        MultiMessageAddress: (contractAddresses[5].result || '0x') as Address,
        MemberTokenAddress: (contractAddresses[6].result || '0x') as Address,
      };
    },
    staleTime: Infinity,
    // throwOnError: () => {},
    // gcTime: Infinity,
  });
};
