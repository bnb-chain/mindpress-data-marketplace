import { Box, Flex } from '@totejs/uikit';
import { reportEvent } from '../../utils/ga';
import { BridgeIcon, DocIcon } from '@totejs/icons';
import GithubIcon from '../svgIcon/GithubIcon';
import { ExplorerIcon } from '../svgIcon/ExplorerIcon';
import { EmailIcon } from '../svgIcon/EmailIcon';
import { TwitterIcon } from '../svgIcon/TwitterIcon';
import { BlogIcon } from '../svgIcon/BlogIcon';
import { DcellarIcon } from '../svgIcon/Dcellar';
import styled from '@emotion/styled';

export const Links = () => {
  return (
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
            <CardItemTitle className="title">Twitter(MindPress)</CardItemTitle>
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
  );
};

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

const CardCon = styled(Flex)``;

const CardItem = styled(Flex)`
  text-align: center;
  width: 190px;
  /* height: 140px; */
  border-radius: 8px;
  background-color: #1e2026;
  line-height: 28px;
  padding-top: 24px;
  padding-bottom: 24px;
  .icon {
    color: #f7f7f8;
  }
  .title {
    color: #f7f7f8;
  }
  &:hover {
    background-color: #373943;
    cursor: pointer;
  }
`;

const CardItemTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #fff;
`;
