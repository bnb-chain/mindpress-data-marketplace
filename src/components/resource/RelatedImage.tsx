import { Box, Flex } from '@totejs/uikit';
import { useGetItemList } from '../../hooks/useGetItemList';
import { Carousel } from '../ui/carousel';
import { MPLink } from '../ui/MPLink';
import styled from '@emotion/styled';

interface IProps {
  title: string;
  categoryId: number;
}

export const RelatedImage = ({ title, categoryId }: IProps) => {
  const { data: categoryRelatedList } = useGetItemList({
    filter: {
      address: '',
      keyword: '',
      categoryId: categoryId,
    },
    offset: 0,
    limit: 10,
    sort: 'CREATION_DESC',
  });

  const allUrl = `/search?c=${categoryId || 100}`;

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Box mb="15px" fontSize="20px" fontWeight={600}>
          {title}
        </Box>
        <SeeAll to={allUrl}>See All</SeeAll>
      </Flex>
      <Carousel list={categoryRelatedList?.items || []} />
    </>
  );
};

const SeeAll = styled(MPLink)`
  color: #f7f7f8;
  font-size: 16px;
  font-weight: 700;
  &:hover {
    color: rgba(247, 247, 248, 0.8);
  }
`;
