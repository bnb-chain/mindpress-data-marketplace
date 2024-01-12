import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';

const DATA = [
  {
    name: 'Lifestyle',
    imageUrl: 'https://picsum.photos/190/190',
  },
  {
    name: 'Landscape',
    imageUrl: 'https://picsum.photos/190/191',
  },
  {
    name: 'AI Generated',
    imageUrl: 'https://picsum.photos/191/190',
  },
  {
    name: 'Beauty & Fashion',
    imageUrl: 'https://picsum.photos/180/190',
  },
  {
    name: 'Technology',
    imageUrl: 'https://picsum.photos/190/180',
  },
  {
    name: 'Sport',
    imageUrl: 'https://picsum.photos/192/190',
  },
];

export const CateList = () => {
  return (
    <CateContainer>
      {DATA.map((item) => (
        <CateItem
          key={item.name}
          bg={`linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${item.imageUrl}) center center`}
          bgSize="cover"
        >
          {item.name}
        </CateItem>
      ))}
    </CateContainer>
  );
};

const CateContainer = styled(Flex)`
  justify-content: space-between;
  gap: 24px;
`;

const CateItem = styled(Box)`
  width: 180px;
  height: 180px;
  line-height: 180px;
  font-size: 16px;
  font-weight: 800;
  text-align: center;
  border-radius: 8px;
`;
