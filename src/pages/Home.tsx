import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import { Ad } from '../components/home/Ad';
import AllList from '../components/home/All';
import { Banner } from '../components/home/Banner';
import { Links } from '../components/home/Links';
import { NotableAuthors } from '../components/home/NotableAuthors';
import { Popular } from '../components/home/Popular';
import { BANNER_IDS } from '../env';

const Home = () => {
  return (
    <Container flexDirection={'column'} alignItems={'center'}>
      <CardBox mt="35px" w="1400px">
        <Banner itemIds={BANNER_IDS} />
      </CardBox>

      <CardBox mt="20px">
        <BoxWithArrow>
          <Box p="50px 32px">
            <TableTitle>Lastest</TableTitle>
            <Box mt="30px">
              <AllList />
            </Box>
          </Box>
        </BoxWithArrow>
      </CardBox>
      <CardBox mt="20px">
        <BoxWithArrow>
          <Box pt="50px" pb="50px">
            <TableTitle pl="32px">Popular</TableTitle>
            <Box>
              <Popular />
            </Box>
          </Box>
        </BoxWithArrow>
      </CardBox>
      <CardBox mt="20px" w="1400px">
        <NotableAuthors />
      </CardBox>
      <CardBox
        mt="20px"
        w="1400px"
        boxShadow="0px 24px 64px 0px rgba(0, 0, 0, 0.48), 0px 4px 0px 0px #ffe900"
      >
        <Ad />
      </CardBox>
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
  border-radius: 32px;
  border: 1px solid #1e2026;
  background: #181a1e;
  overflow: hidden;
`;
