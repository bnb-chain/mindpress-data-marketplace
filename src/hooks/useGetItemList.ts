import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { searchItems } from '../utils/apis';
import { SearchItemsRequest } from '../utils/apis/types';
import { useMemo } from 'react';
import { useGetChainListItems } from './buyer/useGetChainListItems';

export const useGetItemList = (
  params: SearchItemsRequest,
  page = 0,
  pageSize = 10,
) => {
  return useQuery({
    queryKey: ['SEARCH_ITEM_LIST', page, pageSize, params],
    queryFn: () => searchItems(params),
    staleTime: 10000,
    gcTime: 20000,
  });
};

export const TRENDING_PAGE_SIZE = 20;

export const useInfiniteGetItemList = (params: SearchItemsRequest) => {
  const query = useInfiniteQuery({
    queryKey: ['SEARCH_ITEM_LIST', params],
    queryFn: async ({ pageParam }) => {
      // console.log('pageParam', pageParam);
      return await searchItems({
        ...params,
        offset: pageParam * TRENDING_PAGE_SIZE,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      // console.log('lastPage', lastPage);
      // console.log('allPages', allPages);
      // console.log('lastPageParam', lastPageParam);
      // console.log('allPageParams', allPageParams);

      if (lastPage.total > (lastPageParam + 1) * TRENDING_PAGE_SIZE) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    staleTime: 60000,
  });

  const flatData = useMemo(() => {
    return query.data?.pages?.flatMap((page) => page.items);
  }, [query.data]);

  // console.log('flatData', flatData);

  const groupIds = flatData?.map((item) => BigInt(item.groupId));

  const { data: chainGroupsInfo, isLoading: getChainListItemLoading } =
    useGetChainListItems(groupIds);

  // console.log('groupIds', groupIds);
  // console.log('chainGroupsInfo', chainGroupsInfo);

  const total = useMemo(() => {
    return query.data?.pages[0].total || 0;
  }, [query.data?.pages]);

  const flatDataWithUrls = flatData?.map((item, index) => {
    return {
      ...item,
      url: chainGroupsInfo?.urls?.[index] || '',
      ownerAddress: chainGroupsInfo?.creators?.[index] || '',
    };
  });

  return {
    ...query,
    flatData: flatDataWithUrls,
    total,
    isLoading: getChainListItemLoading,
  };
};
