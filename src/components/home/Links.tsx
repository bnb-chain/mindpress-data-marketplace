import styled from '@emotion/styled';
import { Box, Flex } from '@totejs/uikit';
import CopyrightIcon from '../svgIcon/CopyrightIcon';
import { LockIcon } from '../svgIcon/LockIcon';
import StorageIcon from '../svgIcon/StorageIcon';
import UserIcon from '../svgIcon/UserIcon';

export const Links = () => {
  return (
    <Flex
      alignItems={'center'}
      justifyContent={'center'}
      flexDirection={'column'}
      gap={16}
      p="60px"
      mt="20px"
      mb="20px"
    >
      <TitleCon mb="30px">
        <CardTitle>What Makes Us Different?</CardTitle>
      </TitleCon>
      <CardCon gap={24}>
        <CardItem gap={16} flexDirection={'column'}>
          <Box className="icon">
            <StorageIcon w={32} h={32} />
          </Box>
          <CardItemTitle>Decentralized Storage</CardItemTitle>
          <Box className="desc">
            All your files are storage on BNB Greenfield decentralized storage
            network Ownership on Blockchain
          </Box>
        </CardItem>
        <CardItem gap={16} flexDirection={'column'}>
          <Box className="icon">
            <CopyrightIcon w={32} h={32} />
          </Box>
          <CardItemTitle>Copyright on Blockchain</CardItemTitle>
          <Box className="desc">
            Fully ownership and permission control managed by decentralized
            blockchain Data Security
          </Box>
        </CardItem>
        <CardItem gap={16} flexDirection={'column'}>
          <Box className="icon">
            <LockIcon w={32} h={32} color="#FFE900" />
          </Box>
          <CardItemTitle>Data Security</CardItemTitle>
          <Box className="desc">
            Data is stored in a decentralized way with backups User Experience
          </Box>
        </CardItem>
        <CardItem gap={16} flexDirection={'column'}>
          <Box className="icon">
            <UserIcon w={32} h={32} />
          </Box>
          <CardItemTitle>Seamless User Experience</CardItemTitle>
          <Box className="desc">
            Seamless user experience to boost photo trading
          </Box>
        </CardItem>
      </CardCon>
    </Flex>
  );
};

const TitleCon = styled(Flex)``;

const CardTitle = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
`;

const CardCon = styled(Flex)`
  /* align-items: stretch; */
`;

const CardItem = styled(Flex)`
  width: 282px;
  border-radius: 8px;
  color: #c4c5cb;
  font-size: 14px;
  border: 1px solid #373943;
  background-color: #181a1e;
  line-height: 28px;
  padding: 24px;
  .icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: #1e2026;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .desc {
  }
  /* &:hover {
    background-color: #373943;
    cursor: pointer;
  } */
`;

const CardItemTitle = styled(Box)`
  font-size: 16px;
  font-weight: 500;
  color: #f7f7f8;
  -webkit-text-stroke: 1px #f7f7f8;
`;
