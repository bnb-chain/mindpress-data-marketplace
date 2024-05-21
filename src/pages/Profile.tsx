import styled from '@emotion/styled';
import { Box, Flex, Stack } from '@totejs/uikit';
import { useEffect, useMemo } from 'react';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Web3 from 'web3';
import BSCIcon from '../components/svgIcon/BSCIcon';
import { trimLongStr } from '../utils';
import ProfileList from '../components/profile/Index';

const Profile = () => {
  const { address } = useAccount();
  const [p] = useSearchParams();
  const navigator = useNavigate();
  const otherAddress = p.get('address') as string;

  const realAddress = useMemo(() => {
    return otherAddress && Web3.utils.isAddress(otherAddress)
      ? otherAddress
      : address;
  }, [address, otherAddress]);

  useEffect(() => {
    if (!realAddress) {
      navigator(`/`);
    }
  }, [navigator, realAddress]);

  return (
    <Container>
      <PersonInfo gap={32}>
        <ImgCon>
          {realAddress && <MetaMaskAvatar size={120} address={realAddress} />}
        </ImgCon>
        <Info gap={16} justifyContent="flex-end">
          <Username>{trimLongStr(realAddress as string)}</Username>
          <Address>
            <BSCIcon color="#F0B90B" w={24} h={24} />
            {trimLongStr(realAddress as string)}
          </Address>
        </Info>
      </PersonInfo>

      {realAddress && <ProfileList address={realAddress as `0x${string}`} />}
    </Container>
  );
};

export default Profile;

const Container = styled.div`
  width: 1200px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
`;
const PersonInfo = styled(Flex)``;

const ImgCon = styled.div`
  width: 120px;
  height: 120px;

  img {
    background: #d9d9d9;
    border-radius: 24px;
  }
`;

const Info = styled(Stack)``;

const Address = styled(Flex)`
  gap: 4px;
  padding: 12px 16px;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  background-color: #1e2026;
  color: #ffffff;
  border: 1px solid #373943;
  border-radius: 360px;
`;

const Username = styled(Box)`
  font-size: 32px;
  color: #f7f7f8;
`;
