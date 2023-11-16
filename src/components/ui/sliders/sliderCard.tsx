import styled from '@emotion/styled/macro';
import { Box, Flex } from '@totejs/uikit';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { Link, useNavigate } from 'react-router-dom';
import { trimLongStr } from '../../../utils';
import { CATEGORY_MAP } from '../../../utils/category';
interface Props {
  id: number;
  imgUrl: string;
  categoryId: number;
  name: string;
  address: string;
  volumn: string;
  price: string;
}

const BORDER_RADIUS = '16px';

export const SliderCard = (props: Props) => {
  const {
    imgUrl: imageUrl,
    name,
    address,
    price,
    volumn,
    id,
    categoryId,
  } = props;

  const navigator = useNavigate();

  const category = CATEGORY_MAP[categoryId!];

  return (
    <Box boxSizing="border-box" pb="80px" transform="translateX(32px)">
      <MainContainer
        h="408px"
        direction="column"
        padding="8px"
        justifyContent="space-between"
        cursor="pointer"
        onClick={() => {
          navigator(`/resource?id=${id}`);
        }}
        position="relative"
      >
        <Category bgColor={category.bgColor} color={category.color}>
          {category.icon({
            boxSize: 16,
          })}
        </Category>
        <Box h="240px">
          <Image url={imageUrl} />
        </Box>

        {/* address and name */}
        <ContainerAddress justifyContent="space-between" mt="8px" mb="8px">
          <Flex direction="column">
            <Name>{name}</Name>
            <Address>{trimLongStr(address)}</Address>
          </Flex>
          <Box>
            <Link to={`/profile?address=${address}`}>
              {address && <MetaMaskAvatar address={address} size={40} />}
            </Link>
          </Box>
        </ContainerAddress>

        {/* volumn and price */}
        <Container
          justifyContent="flex-start"
          background="#373943"
          borderRadius={BORDER_RADIUS}
        >
          <Value mr="60px">
            <Box as="h2">Volumn</Box>
            <p>{volumn}</p>
          </Value>

          <Value>
            <Box as="h2">Price</Box>
            <p>{price} BNB</p>
          </Value>
        </Container>
      </MainContainer>
    </Box>
  );
};

const ContainerAddress = styled(Flex)`
  padding: 8px 16px;
`;

const Container = styled(Flex)`
  padding: 8px 16px;
`;

const MainContainer = styled(Flex)`
  background: #1e2026;
  border: 1px solid #373943;
  border-radius: ${BORDER_RADIUS};
  box-shadow: 0px 24px 64px 0px rgba(0, 0, 0, 0.48);

  &:hover {
    background: #373943;

    ${Container} {
      background: #5c5f6a;
    }
  }
`;

const Image = styled(Box)<{ url: string }>`
  width: 100%;
  height: 240px;
  background: url(${(props: any) => props.url}) center center no-repeat;
  background-size: cover;
  border-radius: ${BORDER_RADIUS};
  object-fit: cover;
`;

const Name = styled(Box)`
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: #fff;
`;

const Address = styled(Box)`
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  color: #c4c5cb;
`;

const Value = styled(Box)`
  line-height: 24px;

  & > h2 {
    font-size: 16px;
    color: #c4c5cb;
    font-weight: 500;
  }

  & > p {
    font-size: 16px;
    color: #ffffff;
    font-weight: 600;
  }
`;

const Category = styled(Flex)`
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 32px;
  height: 32px;
  top: 8px;
  right: 8px;
  border-radius: 50%;
`;
