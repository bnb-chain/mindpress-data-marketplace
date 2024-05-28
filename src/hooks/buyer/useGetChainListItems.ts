import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { MarketplaceAbi } from '../../base/contract/marketplace.abi';
import { BSC_CHAIN, NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';

export const useGetChainListItems = (groupIds?: bigint[]) => {
  const publicClient = usePublicClient({
    chainId: BSC_CHAIN.id,
  });
  const strGroupIds = groupIds?.map((id) => id.toString());

  return useQuery({
    enabled: !!groupIds,
    queryKey: ['getListItems', strGroupIds],
    queryFn: async () => {
      if (!groupIds) return;
      return await publicClient.readContract({
        abi: MarketplaceAbi,
        address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        functionName: 'getListItems',
        args: [groupIds],
      });
    },
    select: (data) => {
      if (!data) return {};

      return {
        groupNames: data[0],
        descriptions: data[1],
        categoryIds: data[2],
        creators: data[3],
        priceList: data[4],
        urls: data[5],
        objectIds: data[6],
      };
    },
    staleTime: 60_000,
  });
};
