import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import { Ad } from '../components/home/Ad';
import AllList from '../components/home/All';
import { Banner } from '../components/home/Banner';
import { Links } from '../components/home/Links';
import { NotableAuthors } from '../components/home/NotableAuthors';
import { Popular } from '../components/home/Popular';

const Home = () => {
  return (
    <Container flexDirection={'column'} alignItems={'center'}>
      {/* <BannerInfo>
        <img src={Bg} alt="" />
        <Info flexDirection={'column'} gap={26}>
          <Title>
            DECENTRALIZED<br></br> DATA MARKETPLACE
          </Title>
          <SubTitle>
            A Best Practice of BNB Greenfield Cross Chain Programmable Ability.
          </SubTitle>
          <Box
            onClick={() => {
              reportEvent({ name: 'dm.main.banner.build_my_market.click' });
              window.open(
                'https://github.com/bnb-chain/greenfield-data-marketplace-ui',
                '_blank',
              );
            }}
          >
            <GithubCon
              gap={12}
              justifyContent={'flex-start'}
              alignItems={'center'}
            >
              <GithubIcon w={22} h={22} className="githubIcon"></GithubIcon>
              BUILD MY MARKETPLACE
              <LinkArrowIcon w={18} h={18} className="arrow"></LinkArrowIcon>
            </GithubCon>
          </Box>
        </Info>
      </BannerInfo> */}

      <CardBox mt="34px">
        <Banner />
      </CardBox>

      <CardBox mt="20px">
        <BoxWithArrow>
          <Box p="50px 32px">
            <TableTitle>Lastest</TableTitle>
            <Box>
              <AllList />
            </Box>
          </Box>
        </BoxWithArrow>
      </CardBox>

      <CardBox
        mt="20px"
        boxShadow="0px 24px 64px 0px rgba(0, 0, 0, 0.48), 0px 4px 0px 0px #ffe900"
      >
        <BoxWithArrow>
          <Box pt="50px" pb="50px">
            <TableTitle pl="32px">Popular</TableTitle>
            <Box>
              <Popular />
            </Box>
          </Box>
        </BoxWithArrow>
      </CardBox>

      <CardBox mt="20px" w="1200px">
        <NotableAuthors />
      </CardBox>

      <CardBox
        mt="20px"
        w="1200px"
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
  width: 1200px;
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
