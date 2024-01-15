import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { searchItems } from '../utils/apis';
import { SearchItemsRequest } from '../utils/apis/types';
import { useMemo } from 'react';

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

const PAGE_SIZE = 10;

export const useInfiniteGetItemList = () => {
  const query = useInfiniteQuery({
    queryKey: ['SEARCH_ITEM_LIST'],
    queryFn: async ({ pageParam }) => {
      // console.log('pageParam', pageParam);
      return await searchItems({
        filter: {
          address: '',
          keyword: '',
        },
        offset: pageParam * PAGE_SIZE,
        limit: PAGE_SIZE,
        sort: 'CREATION_DESC',
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) => {
      // console.log('lastPage', lastPage);
      // console.log('allPages', allPages);
      // console.log('lastPageParam', lastPageParam);
      // console.log('allPageParams', allPageParams);

      if (lastPage.total > lastPageParam * PAGE_SIZE) {
        return lastPageParam + 1;
      }
      return undefined;
    },
    staleTime: 60000,
  });

  const flatData = useMemo(() => {
    return query.data?.pages?.flatMap((page) => page.items);
  }, [query.data]);

  return {
    ...query,
    flatData,
  };
};
