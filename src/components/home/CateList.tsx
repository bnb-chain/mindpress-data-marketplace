import styled from '@emotion/styled';
import { Flex } from '@totejs/uikit';
import { useGetCatoriesMap } from '../../hooks/apis/useGetCatoriesMap';
import { Loader } from '../Loader';
import { MPLink } from '../ui/MPLink';

export const CateList = () => {
  const { data: cates, isLoading } = useGetCatoriesMap();

  if (isLoading || !cates) {
    return <Loader />;
  }

  return (
    <CateContainer>
      {cates.slice(0, 6).map((category) => {
        const imageUrl = `https://picsum.photos/seed/${category.name.replaceAll(
          ' ',
          '',
        )}/200/200`;
        return (
          <CateItem
            key={category.id}
            bg={`linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${imageUrl}) center center`}
            bgSize="cover"
            to={`/search?c=${category.id}`}
          >
            {category.name}
          </CateItem>
        );
      })}
    </CateContainer>
  );
};

const CateContainer = styled(Flex)`
  justify-content: space-between;
  gap: 24px;
`;

const CateItem = styled(MPLink)`
  color: #f7f7f8;
  width: 180px;
  height: 180px;
  line-height: 180px;
  font-size: 16px;
  font-weight: 800;
  text-align: center;
  border-radius: 8px;

  &:hover {
    color: rgba(247, 247, 248, 0.8);
  }
`;
