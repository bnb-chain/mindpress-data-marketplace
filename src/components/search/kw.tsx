import React, { useCallback } from 'react';
import { useInfiniteGetItemList } from '../../hooks/useGetItemList';
import { Empty } from './empty';
import { Box } from '@totejs/uikit';
import { MindPressMasmonry } from '../ui/masmonry';
import { Desc } from './desc';
import { Loader } from '../Loader';

interface Props {
  kw: string;
}

export const Kw: React.FC<Props> = ({ kw }) => {
  const {
    fetchNextPage,
    hasNextPage,
    total = 0,
    flatData: searchList = [],
    isPending,
  } = useInfiniteGetItemList({
    filter: {
      address: '',
      keyword: kw,
    },
    offset: 0,
    limit: 20,
    sort: 'CREATION_DESC',
  });

  // console.log('total', total);
  // console.log('searchList', searchList);

  const handleNextPage = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  if (isPending) {
    return <Loader />;
  }

  if (total === 0) {
    return <Empty text={kw} />;
  }

  return (
    <>
      <Desc text={kw} total={total} />
      <Box mt="40px">
        <MindPressMasmonry
          list={searchList}
          hasMore={hasNextPage}
          handleLoadMore={handleNextPage}
        />
      </Box>
    </>
  );
};
