import { Box, Flex } from '@totejs/uikit';
import styled from '@emotion/styled';
import MindPress from '../../images/mindpress.png';
import { Sliders } from '../sliders';

export const Banner = () => {
  return (
    <Box>
      <BannerBox>
        <Box
          pl="32px"
          pr="16px"
          background={`url(${MindPress}) no-repeat right 32px`}
          backgroundSize="600px auto"
        >
          <Title>Sell & Collect Data</Title>
          <Desc mt="16px">in Decentralized Data Marketplace</Desc>
          <Line mt="32px" />
        </Box>

        <Box mt="50px" maxW="1200px">
          <Sliders />
        </Box>
      </BannerBox>

      {/* <A>
          <B />
        </A> */}
    </Box>
  );
};

const A = styled(Flex)`
  height: 60px;
  margin-top: 40px;
  width: 800px;
  background: #181a1e;
  border: 1px solid #fff;
  border-radius: 0 40px 0 0;
  padding-top: 20px;
`;

const B = styled(Flex)`
  width: 780px;
  height: 60px;
  background: red;
  border-radius: 0 40px 0 0;

  /* &::before {
    content: '';
    background: #181a1e;
    flex: 1;
    border-radius: 0 20px 0 0;
  }

  &::after {
    content: '';
    width: 120px;
    background: #181a1e;
  } */
`;

const BannerBox = styled(Box)`
  /* margin-top: 32px; */
  /* padding: 32px; */
  background: #181a1e;
  border-radius: 32px;
`;

const Title = styled(Box)`
  font-size: 48px;
  font-weight: 600;
  line-height: 56px;
  padding-top: 32px;
  color: #ffe900;
`;

const Line = styled(Box)`
  height: 1px;
  background: #373943;
`;

const Desc = styled(Box)`
  font-size: 32px;
  font-weight: 400;
  color: #fff;
`;
