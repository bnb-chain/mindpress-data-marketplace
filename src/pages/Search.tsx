import styled from '@emotion/styled';
import { Box, Center, Flex } from '@totejs/uikit';
import { useSearchParams } from 'react-router-dom';
import { useInfiniteGetItemList } from '../hooks/useGetItemList';
import { MindPressMasmonry } from '../components/ui/masmonry';
import { useCallback } from 'react';
import NoData from '../images/NoData.svg';
import { useGetCategory } from '../hooks/apis/useGetCatoriesMap';
import { RelatedImage } from '../components/resource/RelatedImage';

const Search = () => {
  const [p] = useSearchParams();
  // search keyword
  const kw = (p.get('kw') as string) || '';
  // search category id
  const c = (p.get('c') as string) || '-1';
  const category = useGetCategory(Number(c));

  const {
    fetchNextPage,
    hasNextPage,
    total,
    flatData: searchList,
  } = useInfiniteGetItemList({
    filter: {
      address: '',
      keyword: kw,
      categoryId: Number(c),
    },
    offset: 0,
    limit: 20,
    sort: 'CREATION_DESC',
  });

  const handleNextPage = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  // if (!kw || !c) return null;

  if (total === 0) {
    return (
      <Container>
        <Box flexDirection="column" mt="40px" gap="40px">
          <Box color="#F7F7F8" fontSize="32px" fontWeight="800">
            {`We couldn\'t find anything for "`}
            <Box as="span" color="#FFE900">
              {kw || category?.name}
            </Box>
            {`".`}
          </Box>
          <Center flexDirection="column" gap="24px">
            <img src={NoData} alt="no data" />
            <Box
              color="#C4C5CB"
              fontSize="16px"
              lineHeight="24px"
              fontWeight="600"
            >
              Try adjusting your search to find what you are looking for.
            </Box>
          </Center>
        </Box>

        <Box mt="40px">
          <RelatedImage
            title="Images you might be interested in"
            categoryId={category?.id || 100}
          />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Keyword>{kw || category?.name}</Keyword>
      <Desc>
        {total} images found for "{kw || category?.name}".
      </Desc>

      <Box mt="40px">
        <MindPressMasmonry
          list={searchList}
          hasMore={hasNextPage}
          handleLoadMore={handleNextPage}
        />
      </Box>

      {total < 20 && (
        <Box mt="40px">
          <RelatedImage
            title="Images you might be interested in"
            categoryId={category?.id || 100}
          />
        </Box>
      )}
    </Container>
  );
};

export default Search;

const Container = styled(Box)`
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
`;

const Keyword = styled(Flex)`
  color: #f7f7f8;
  font-size: 32px;
  font-weight: 700;
  background-color: #14151a;
`;

const Desc = styled(Box)`
  margin-top: 16px;
  color: #8c8f9b;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
`;
