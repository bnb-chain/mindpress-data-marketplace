import { useQuery } from '@tanstack/react-query';
import { usePublicClient } from 'wagmi';
import { MarketplaceAbi } from '../../base/contract/marketplace.abi';
import { BSC_CHAIN, NEW_MARKETPLACE_CONTRACT_ADDRESS } from '../../env';
import { searchItems } from '../../utils/apis';
import { SearchItemsResponse } from '../../utils/apis/types';
import { useGetChainListItems } from '../buyer/useGetChainListItems';
import _ from 'lodash';

export const useGetCategoryGroupIds = (categoryId: string) => {
  const publicClient = usePublicClient({
    chainId: BSC_CHAIN.id,
  });

  return useQuery({
    queryKey: ['GET_CATEGORY_GROUP_IDS', categoryId],
    queryFn: async () => {
      const groupIds = await publicClient.readContract({
        address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
        abi: MarketplaceAbi,
        functionName: 'getListedGroupIds',
        args: [BigInt(categoryId)],
      });

      return groupIds;
      // console.log('groupIds', groupIds);

      // const chainGroupsInfo = await publicClient.readContract({
      //   abi: MarketplaceAbi,
      //   address: NEW_MARKETPLACE_CONTRACT_ADDRESS,
      //   functionName: 'getListItems',
      //   args: [groupIds],
      // });

      // return chainGroupsInfo;
    },
  });
};

export const PAGE_SIZE = 10;

const loadAllPages = async () => {
  let result: SearchItemsResponse['items'] = [];
  let page = 0;

  const fetchSinglePage = async (page: number) => {
    return await searchItems({
      filter: {
        address: '',
        keyword: '',
      },
      limit: PAGE_SIZE,
      sort: 'CREATION_DESC',
      offset: page * PAGE_SIZE,
    });
  };

  const res = await fetchSinglePage(page);
  result = result.concat(res.items);

  while (page * PAGE_SIZE < res.total) {
    page++;
    const res = await fetchSinglePage(page);
    // console.log('res', page, res);
    result = result.concat(res.items);
    // console.log('result', result);
  }

  return {
    list: result,
    // total: res.total,
  };
};

export const useGetCategoryList = (categoryId: string) => {
  const { data: groupIds } = useGetCategoryGroupIds(categoryId);
  const { data: chainGroupsInfo, isLoading: getChainListItemLoading } =
    useGetChainListItems(groupIds);

  return useQuery({
    enabled: !!groupIds && groupIds.length > 0 && !getChainListItemLoading,
    queryKey: ['SEARCH_CATEGORY_LIST', categoryId],
    queryFn: async () => {
      if (!groupIds) return;

      const { list } = await loadAllPages();

      // console.log('flatData', list);
      // console.log('groupIds', groupIds);
      // console.log('chainGroupsInfo', chainGroupsInfo);

      const filterCategorList = _.orderBy(list, ['groupId'], 'asc')
        ?.filter((item) => {
          return groupIds.includes(BigInt(item.groupId));
        })
        .map((item, index) => {
          console.log('utem', item);
          return {
            ...item,
            url: chainGroupsInfo?.urls?.[index] || '',
            ownerAddress: chainGroupsInfo?.creators?.[index] || '',
          };
        });

      console.log('flatDataWithUrls', filterCategorList);

      // const filterCategorList = flatDataWithUrls

      // console.log('filterCategorList', filterCategorList);
      return {
        flatData: filterCategorList,
        total: filterCategorList.length,
      };
    },
    staleTime: 60000,
  });
};
