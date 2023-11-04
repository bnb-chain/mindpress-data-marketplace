import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import { ReactNode } from 'react';
import ProfileImage from '../svgIcon/ProfileImage';
interface Props {
  children: React.ReactNode;
  tag?: ReactNode | string;
}

const BORDER_RADIUS = '16px';

// active
// border="1px solid #373943"
// background #5c5f6a

export const Card = (props: Props) => {
  return (
    <Box w="340px">
      <Flex
        background="#1E2026"
        h="408px"
        borderRadius={BORDER_RADIUS}
        overflow="hidden"
        boxShadow="0px 24px 64px 0px rgba(0, 0, 0, 0.48)"
        padding="8px"
        direction="column"
        justifyContent="space-around"
      >
        <Box h="240px" overflow="hidden">
          <Image url="https://source.unsplash.com/random/400x400" />
        </Box>
        {/* <Box>{props.children}</Box> */}

        <Container justifyContent="space-between" mt="8px" mb="8px">
          <Flex direction="column">
            <Name>Hero Kids #1</Name>
            {/* https://effigy.im/a/0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045.png */}
            {/* https://www.npmjs.com/package/ethereum-blockies */}
            <Address>0x2142...B391</Address>
          </Flex>
          <Box>
            <ProfileImage w="40px" h="40px" />
          </Box>
        </Container>

        <Container
          justifyContent="flex-start"
          background="#373943"
          borderRadius={BORDER_RADIUS}
        >
          <Value mr="60px">
            <Box as="h2">Volumn</Box>
            <p>1000</p>
          </Value>

          <Value>
            <Box as="h2">Price</Box>
            <p>20.52 BNB</p>
          </Value>
        </Container>
      </Flex>
    </Box>
  );
};

const Image = styled(Box)<{ url: string }>`
  width: 100%;
  height: 240px;
  background: url(${(props: any) => props.url}) center center no-repeat;
  background-size: cover;
  border-radius: ${BORDER_RADIUS};
`;

const Container = styled(Flex)`
  padding: 8px 16px;
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
