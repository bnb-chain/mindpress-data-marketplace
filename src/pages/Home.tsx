import styled from '@emotion/styled';
import { DocIcon, FullTeamIcon } from '@totejs/icons';
import { Box, Flex } from '@totejs/uikit';
import { Ad } from '../components/home/Ad';
import AllList from '../components/home/All';
import { Banner } from '../components/home/Banner';
import BSCIcon from '../components/svgIcon/BSCIcon';
import DiscordIcon from '../components/svgIcon/DiscordIcon';
import GithubIcon from '../components/svgIcon/GithubIcon';
import { reportEvent } from '../utils/ga';
import { BridgeIcon } from '../components/svgIcon/BridgeIcon';
import { ExplorerIcon } from '../components/svgIcon/ExplorerIcon';
import { EmailIcon } from '../components/svgIcon/EmailIcon';
import { TwitterIcon } from '../components/svgIcon/TwitterIcon';
import { BlogIcon } from '../components/svgIcon/BlogIcon';
import { DcellarIcon } from '../components/svgIcon/Dcellar';
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
          <TableTitle>Lastest</TableTitle>
          <Box>
            <AllList />
          </Box>
        </BoxWithArrow>
      </CardBox>

      <CardBox mt="20px">
        <BoxWithArrow>
          <TableTitle>Popular</TableTitle>
          <Box>
            <Popular />
          </Box>
        </BoxWithArrow>
      </CardBox>

      <CardBox mt="20px" w="100%">
        <Ad />
      </CardBox>

      <Cards
        alignItems={'center'}
        justifyContent={'center'}
        flexDirection={'column'}
        gap={16}
        p="60px"
        mt="20px"
        mb="20px"
      >
        <TitleCon mb="30px">
          <CardTitle>Wanna to build on BNB Greenfield?</CardTitle>
        </TitleCon>
        <CardCon gap={16}>
          <Box
            onClick={() => {
              reportEvent({ name: 'dm.main.body.gnfd_doc.click' });
              window.open(
                'https://docs.bnbchain.org/greenfield-docs/docs/guide/home',
                '_blank',
              );
            }}
          >
            <CardItem alignItems={'center'} gap={16} flexDirection={'column'}>
              <DocIcon w={32} h={32} className="icon"></DocIcon>
              <CardItemTitle className="title">Documentation</CardItemTitle>
            </CardItem>
          </Box>
          <Box
            onClick={() => {
              reportEvent({ name: 'dm.main.body.gnfd_github.click' });
              window.open(
                'https://docs.bnbchain.org/greenfield-docs/docs/guide/home',
                '_blank',
              );
            }}
          >
            <CardItem alignItems={'center'} gap={16} flexDirection={'column'}>
              <GithubIcon w={32} h={32} className="icon"></GithubIcon>
              <CardItemTitle className="title">Github</CardItemTitle>
            </CardItem>
          </Box>
          <Box
            onClick={() => {
              reportEvent({ name: 'dm.main.body.gnfd_forum.click' });
              window.open(
                'https://greenfield.bnbchain.org/en/bridge?type=transfer-in',
                '_blank',
              );
            }}
          >
            <CardItem alignItems={'center'} gap={16} flexDirection={'column'}>
              <BridgeIcon w={32} h={32} className="icon"></BridgeIcon>
              <CardItemTitle className="title">Bridge</CardItemTitle>
            </CardItem>
          </Box>
          <Box
            onClick={() => {
              reportEvent({ name: 'dm.main.body.gnfd_discord.click' });
              window.open('https://greenfieldscan.com/', '_blank');
            }}
          >
            <CardItem alignItems={'center'} gap={16} flexDirection={'column'}>
              <ExplorerIcon w={32} h={32} className="icon" />
              <CardItemTitle className="title">Discord</CardItemTitle>
            </CardItem>
          </Box>
        </CardCon>
        <CardCon gap={16}>
          <Box
            onClick={() => {
              reportEvent({ name: 'dm.main.body.contract_me.click' });
              window.open('', '_blank');
            }}
          >
            <CardItem alignItems={'center'} gap={16} flexDirection={'column'}>
              <EmailIcon w={32} h={32} className="icon"></EmailIcon>
              <CardItemTitle className="title">Contract Us</CardItemTitle>
            </CardItem>
          </Box>
          <Box
            onClick={() => {
              reportEvent({ name: 'dm.main.body.twitter.click' });
              window.open('', '_blank');
            }}
          >
            <CardItem alignItems={'center'} gap={16} flexDirection={'column'}>
              <TwitterIcon w={32} h={32} className="icon"></TwitterIcon>
              <CardItemTitle className="title">
                Twitter(MindPress)
              </CardItemTitle>
            </CardItem>
          </Box>
          <Box
            onClick={() => {
              reportEvent({ name: 'dm.main.body.blog.click' });
              window.open('', '_blank');
            }}
          >
            <CardItem alignItems={'center'} gap={16} flexDirection={'column'}>
              <BlogIcon w={32} h={32} className="icon"></BlogIcon>
              <CardItemTitle className="title">MindPress blog</CardItemTitle>
            </CardItem>
          </Box>
          <Box
            onClick={() => {
              reportEvent({ name: 'dm.main.body.dcellar.click' });
              window.open('https://dcellar.io/', '_blank');
            }}
          >
            <CardItem alignItems={'center'} gap={16} flexDirection={'column'}>
              <DcellarIcon w={32} h={32} className="icon" />
              <CardItemTitle className="title">dCellar</CardItemTitle>
            </CardItem>
          </Box>
        </CardCon>
      </Cards>
    </Container>
  );
};

export default Home;

const Container = styled(Flex)`
  /* margin-top: -80px; */
  /* width: 100%; */
  /* background-color: #1e2026; */
`;

const BannerInfo = styled.div`
  position: relative;
  width: 100%;
  height: 564px;
  background-color: #000;
  img {
    position: absolute;
    min-width: 1440px;
    height: 564px;
    right: 0;
  }
`;

const Info = styled(Flex)`
  position: absolute;
  top: 228px;
  left: 148px;
`;

const Title = styled.div`
  font-size: 58px;
  font-weight: 400;
  line-height: 58px;
  font-family: 'Zen Dots';
`;

const SubTitle = styled.div`
  font-size: 24px;
  font-weight: 400;
  color: #b9b9bb;
`;

const GithubCon = styled(Flex)`
  cursor: pointer;
  color: #f0b90b;
  .githubIcon {
    color: #cc9d09;
  }
  .arrow {
    color: #cc9d09;
  }
  &:hover {
    color: #f8d12f;
    .githubIcon {
      color: #f0b90b;
    }
    .arrow {
      color: #f0b90b;
    }
  }
`;

const WorkInfo = styled(Flex)`
  margin-top: 70px;
  width: 1200px;
  padding: 24px 40px;
`;

const WorkMainTitle = styled.div`
  text-align: center;
  font-size: 42px;
  font-weight: 700;
  color: #ffffff;
`;

const WorkItem = styled(Flex)``;

const WorkTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
`;

const WorkDesc = styled.div`
  font-size: 18px;
  font-weight: 400;
  color: #b9b9bb;
`;

const Cards = styled(Flex)`
  /* margin: 80px 0 114px; */
  background-color: #181a1e;
  width: 1200px;
  /* height: 426px; */
  border-radius: 32px;
  border: 2px solid #1e2026;
`;

const TitleCon = styled(Flex)``;

const CardTitle = styled.div`
  font-size: 34px;
  font-weight: 700;
  color: #ffffff;
`;

const CardSubTitle = styled.div`
  font-size: 20px;
  font-weight: 400;
  color: #b9b9bb;
`;

const CardCon = styled(Flex)``;

const CardItem = styled(Flex)`
  text-align: center;
  width: 190px;
  /* height: 140px; */
  border-radius: 8px;
  background-color: #1f2026;
  line-height: 28px;
  padding-top: 24px;
  padding-bottom: 24px;
  .icon {
    /* margin-top: 22.3px; */
  }
  .title {
    color: #fff;
  }
  &:hover {
    background-color: #fff;
    cursor: pointer;

    .icon {
      /* margin-top: 22.3px; */
      color: #535458;
    }
    .title {
      color: #535458;
    }
  }
`;

const CardItemTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #fff;
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
  padding-top: 50px;
  padding-bottom: 50px;
  padding-left: 32px;
  padding-right: 32px;
  background: #181a1e;
  border: 1px solid #1e2026;
  border-radius: 16px;
`;

const CardBox = styled(Box)`
  border-radius: 32px;
  border: 1px solid #1e2026;
  background: #181a1e;
  box-shadow: 0px 24px 64px 0px rgba(0, 0, 0, 0.48), 0px 4px 0px 0px #ffe900;
  overflow: hidden;
`;
