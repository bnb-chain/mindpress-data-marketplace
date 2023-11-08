import styled from '@emotion/styled/macro';
import { Box, Flex } from '@totejs/uikit';
import { ReactNode } from 'react';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { Link, useNavigate } from 'react-router-dom';
import { trimLongStr } from '../../utils';
interface Props {
  id: number;
  imgUrl: string;
  tag?: ReactNode | string;
  name: string;
  groupName: string;
  address: string;
  volumn: number;
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
    groupName,
  } = props;

  const navigator = useNavigate();

  return (
    <Box boxSizing="border-box" pb="80px" transform="translateX(32px)">
      <MainContainer
        h="408px"
        direction="column"
        padding="8px"
        justifyContent="space-between"
        cursor="pointer"
        onClick={() => {
          navigator(
            `/resource?gid=${id}&gn=${groupName}&address=${address}&from=${encodeURIComponent(
              JSON.stringify([props]),
            )}`,
          );
        }}
      >
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
            <Link
              onClick={(e) => {
                e.stopPropagation();
                // e.preventDefault();
              }}
              to={`/profile?address=${address}`}
            >
              {address && <MetaMaskAvatar address={address} size={40} />}
            </Link>

            {/* <ProfileImage w="40px" h="40px" /> */}
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
  font-weight: 500;
  line-height: 28px;
  color: #fff;
`;

const Address = styled(Box)`
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  color: #c4c5cb;
`;

const Value = styled(Box)`
  line-height: 24px;

  & > h2 {
    font-size: 16px;
    color: #c4c5cb;
    font-weight: 400;
  }

  & > p {
    font-size: 16px;
    color: #ffffff;
    font-weight: 500;
  }
`;
