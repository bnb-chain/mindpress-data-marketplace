import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';

import { Banner } from '../components/home/Banner';
import { CateList } from '../components/home/CateList';
import { Links } from '../components/home/Links';
import { Trending } from '../components/home/Trending';

const Home = () => {
  return (
    <Container flexDirection={'column'} alignItems={'center'}>
      <Banner />

      <Box mt="40px" mb="40px">
        <CateList />
      </Box>

      <Box w="1440px" ml="auto" mr="auto">
        <Trending />
      </Box>

      <Links />
    </Container>
  );
};

export default Home;

const Container = styled(Flex)`
  /* margin-top: -80px; */
  /* width: 100%; */
  /* background-color: #1e2026; */
`;

const TableTitle = styled(Box)`
  font-size: 32px;
  font-weight: 600;
  line-height: 40px; /* 125% */
`;

const BoxWithArrow = styled(Box)`
  width: 1400px;
  /* justify-content: center;
  align-items: center; */
  /* padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 32px;
  padding-right: 32px; */
  background: #181a1e;
  border: 1px solid #1e2026;
  border-radius: 16px;
`;

const CardBox = styled(Box)`
  width: 1400px;
  /* padding-left: 100px;
  padding-right: 100px; */
  border-radius: 32px;
  border: 1px solid #1e2026;
  background: #181a1e;
  overflow: hidden;
`;
