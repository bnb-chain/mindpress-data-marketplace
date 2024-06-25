import styled from '@emotion/styled';
import { WalletKitButton } from '@node-real/walletkit';
import '@node-real/walletkit/styles.css';
import {
  Box,
  Button,
  Center,
  Flex,
  Link,
  useOutsideClick,
} from '@totejs/uikit';
import { useWindowScroll } from '@uidotdev/usehooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccount, useDisconnect } from 'wagmi';
import { NET_ENV } from '../../env';
import TestNetLogo from '../../images/logo-testnet.svg';
import MainNetLogo from '../../images/logo.svg';
import { trimLongStr } from '../../utils';
import { Copy } from '../Copy';
import Search from '../search-box';
import { MyDataCollectionIcon } from '../svgIcon/MyDataCollectionIcon';
import { SellIcon } from '../svgIcon/SellIcon';
import { SignOutIcon } from '../svgIcon/SignOutIcon';

const BG_COLOR = '#181a1e';
const INFO_BAR_HEIGHT = '40px';

const Header = () => {
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const { address, isConnecting, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const handleShowDropDown = useCallback(() => {
    setDropDownOpen((preState) => !preState);
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  const ref2 = useRef<HTMLDivElement>(null);
  const [{ y }] = useWindowScroll();

  const navigate = useNavigate();
  const location = useLocation();

  useOutsideClick({
    ref: ref2,
    handler: () => setDropDownOpen(false),
  });

  useEffect(() => {
    if (!ref.current) return;
    // if (location.pathname !== '/') return;

    if (y && y > 10) {
      ref.current.style.backgroundColor = BG_COLOR;
    } else {
      ref.current.style.backgroundColor = 'transparent';
    }
  }, [location.pathname, y]);

  return (
    <>
      <Box
        bg="#53EAA1"
        h={INFO_BAR_HEIGHT}
        lineHeight="40px"
        color="#181A1E"
        pos="fixed"
        top="0"
        left="0"
        right="0"
        zIndex={1001}
      >
        <Center gap="8px">
          <Box as="p" fontSize="14px" fontWeight={400}>
            🚀 This website serves as a demo dApp on BNB Greenfield, and is only
            live on Testnet for feature demonstration purposes.
          </Box>
          <Link
            color="#181A1E"
            href="https://docs.bnbchain.org/bnb-greenfield/for-developers/tutorials/app/data-marketplace/"
            target="_blank"
            fontWeight={500}
            textDecoration="underline"
            _hover={{
              color: '#181A1E',
            }}
          >
            Learn More
          </Link>
        </Center>
      </Box>
      <HeaderFlex
        justifyContent={'space-between'}
        alignItems={'center'}
        padding={'0px 24px 0'}
        height={80}
        top={INFO_BAR_HEIGHT}
        bg={location.pathname !== '/' ? BG_COLOR : 'transparent'}
        ref={ref}
      >
        <LeftCon h="50px" gap={40} alignItems={'center'}>
          <img
            title="market place"
            onClick={() => {
              navigate('/');
            }}
            src={NET_ENV === 'TESTNET' ? TestNetLogo : MainNetLogo}
            alt="logo"
          />
          {location.pathname !== '/' && <Search width="380px" height="40px" />}
        </LeftCon>

        <RightFunCon
          alignItems={'center'}
          justifyContent={'center'}
          gap={18}
          ref={ref2}
        >
          <>
            <Button
              variant="ghost"
              bg="transparent"
              color="#F1F2F3"
              borderColor="#F1F2F3"
              borderRadius="8px"
              fontWeight={500}
              h="40px"
              _hover={{
                background: 'rgba(241, 242, 243, 0.9)',
                color: 'rgb(24, 26, 30)',
              }}
              onClick={() => {
                console.log('location', location);
                if (
                  location.pathname === '/profile' &&
                  location.search === '?tab=uploaded'
                ) {
                  window.scrollTo({
                    top: 150,
                    behavior: 'smooth',
                  });
                } else {
                  navigate('/profile?tab=uploaded');
                }
              }}
            >
              List Images
            </Button>
          </>

          <ButtonWrapper>
            {!isConnected && !isConnecting ? (
              // <WalletKitButton />
              <WalletKitButton.Custom>
                {({ show }) => {
                  return (
                    <StyledButton h="40px" onClick={show}>
                      Connect Wallet
                    </StyledButton>
                  );
                }}
              </WalletKitButton.Custom>
            ) : (
              <ConnectProfile
                onClick={() => {
                  try {
                    if (isConnected && !dropDownOpen) handleShowDropDown();
                  } catch (e) {
                    //eslint-disable-next-line no-console
                    console.log(e);
                  }
                }}
              >
                <ProfileWrapper ml={3} gap={10}>
                  <Profile
                    outline={
                      dropDownOpen ? '1px solid #FFE900' : '1px solid #373943'
                    }
                  >
                    {address && <MetaMaskAvatar address={address} size={32} />}
                  </Profile>
                </ProfileWrapper>
              </ConnectProfile>
            )}
            {dropDownOpen && isConnected && !isConnecting && (
              <DropDown>
                <Flex alignItems="center" pl="24px" pr="24px">
                  <Flex gap="12px" flex={1} alignItems="center">
                    <ImageWrapper>
                      {address && (
                        <MetaMaskAvatar address={address} size={40} />
                      )}
                    </ImageWrapper>
                    <Address>
                      {address ? trimLongStr(address, 10, 6, 4) : ''}
                    </Address>
                  </Flex>
                  <Copy
                    color="#C4C5CB"
                    size={{ w: 26, h: 26 }}
                    value={address}
                  />
                </Flex>

                <Hr mt="16px" mb="8px" />

                <MenuElement
                  onClick={async (e: React.MouseEvent<HTMLElement>) => {
                    e.preventDefault();
                    navigate('/profile?tab=uploaded');
                  }}
                >
                  <MyDataCollectionIcon mr={8} width={24} height={24} />
                  My Uploaded
                </MenuElement>
                <MenuElement
                  onClick={async (e: React.MouseEvent<HTMLElement>) => {
                    e.preventDefault();
                    navigate('/profile?tab=purchased');
                  }}
                >
                  <SellIcon mr={8} w={24} height={24} />
                  My Purchases
                </MenuElement>
                <MenuElement
                  onClick={async () => {
                    await disconnect();
                    navigate('/');
                  }}
                >
                  <SignOutIcon
                    mr={8}
                    width={24}
                    height={24}
                    style={{ transform: 'rotate(-90deg)' }}
                  />{' '}
                  Sign Out
                </MenuElement>
              </DropDown>
            )}
          </ButtonWrapper>
        </RightFunCon>
      </HeaderFlex>
    </>
  );
};

export default Header;

const HeaderFlex = styled(Flex)`
  position: fixed;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 0 40px;
  transition: background 0.3s ease-in-out;
`;
const LeftCon = styled(Flex)`
  img {
    width: 224px;
    height: 40px;
    cursor: pointer;
  }
`;

const StyledButton = styled(Button)`
  background: #f1f2f3;
  color: #181a1e;
  width: 100%;
  // max-width: 158px;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  &:hover {
    background: rgba(241, 242, 243, 0.9);
    color: rgb(24, 26, 30);
  }
  &.connected {
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    background: ${(props: any) => props.theme.colors.bg?.middle};
    color: ${(props: any) => props.theme.colors.readable.normal};
    /* border: 1px solid ${(props: any) =>
      props.theme.colors.readable.border}; */
    &:hover {
      background: ${(props: any) => props.theme.colors.bg?.bottom};
    }
  }
`;

const ButtonWrapper = styled.div`
  position: relative;
  font-weight: 500;
`;

const DropDown = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  margin-top: 4px;
  border-radius: 12px;
  width: 335px;
  background: #373943;
  box-shadow: ${(props: any) => props.theme.shadows.normal};
  z-index: 11;
  padding: 16px 0;
`;

const Address = styled(Flex)`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #fbfbfb;
`;

const ImageWrapper = styled(Flex)`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const ProfileWrapper = styled(Flex)`
  align-items: center;
  gap: 10px;
`;

const Profile = styled(Flex)`
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  padding: 4px;
  /* width: 36px;
  height: 36px; */
  /* outline: 1px solid ${(props: any) =>
    props.theme.colors.readable.border}; */
`;

const MenuElement = styled(Flex)`
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  padding: 20px 24px;
  color: #c4c5cb;

  &:hover {
    cursor: pointer;
    background: #5c5f6a;
    color: #f7f7f8;
  }
`;

const RightFunCon = styled(Flex)``;

const ConnectProfile = styled(Flex)`
  align-items: center;
  cursor: pointer;
  width: 100%;
  max-width: 158px;
  height: 44px;
  font-family: Space Grotesk;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  /* &:hover {
    background: ${(props: any) => props.theme.colors.read?.normal};
  } */
`;

const Hr = styled(Box)`
  height: 1px;
  background: #5c5f6a;
`;
