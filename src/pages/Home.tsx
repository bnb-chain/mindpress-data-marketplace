import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';

import { Banner } from '../components/home/Banner';
import { CateList } from '../components/home/CateList';
import { Disclaimer } from '../components/home/Disclaimer';
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

      <Disclaimer />
    </Container>
  );
};

export default Home;

const Container = styled(Flex)`
  margin-top: -80px;
  /* width: 100%; */
  /* background-color: #1e2026; */
`;
