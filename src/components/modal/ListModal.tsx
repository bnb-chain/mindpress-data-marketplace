import NiceModal from '@ebay/nice-modal-react';
import styled from '@emotion/styled';
import { ColoredWarningIcon, ReverseVIcon } from '@totejs/icons';
import {
  Box,
  Button,
  Flex,
  QDrawer,
  QDrawerBody,
  QDrawerCloseButton,
  QDrawerFooter,
  QDrawerHeader,
  Stack,
  Text,
} from '@totejs/uikit';
import { useImmerAtom } from 'jotai-immer';
import { useCallback, useMemo } from 'react';
import { formatEther } from 'viem';
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from 'wagmi';
import { listAtom } from '../../atoms/listAtom';
import { BSC_CHAIN } from '../../env';
import { useList } from '../../hooks/seller/useList';
import { useGetBnbUsdtExchangeRate } from '../../hooks/useGetBnbUsdtExchangeRate';
import { useGetItemByObjId } from '../../hooks/useGetItemByObjId';
import { Loader } from '../Loader';
import BSCIcon from '../svgIcon/BSCIcon';
import { YellowButton } from '../ui/buttons/YellowButton';
import { Tips } from './Tips';

export const ListModal = () => {
  const [listInfo, setListInfo] = useImmerAtom(listAtom);
  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { data: BscBalanceVal } = useBalance({
    chainId: BSC_CHAIN.id,
    address,
  });

  // const { data: categories } = useGetCatoriesMap();

  const { chain } = useNetwork();

  const { refetch: refetchListStatus } = useGetItemByObjId(
    String(listInfo.data.objectId),
  );

  const reset = useCallback(() => {
    setListInfo((draft) => {
      draft.open = false;
    });
  }, [setListInfo]);

  const {
    isApproved,
    doList,
    start: listStart,
    totalFee,
  } = useList({
    data: {
      bucketId: listInfo.data.bucketId,
      objectId: listInfo.data.objectId,
      objectPrice: listInfo.data.price,
    },
    onSuccess: async () => {
      NiceModal.show(Tips, {
        title: ``,
        content: (
          <Box>
            <img src={listInfo.data.imageUrl} />
            <Text as="h2" fontSize="24px" mt="20px">
              Your item has been listed!
            </Text>
            <Text fontSize="14px">
              <Box as="span" color="">
                Cement panel ceiling square block pattern Lighting Architecture
                details
              </Box>{' '}
              has been listed on MindPress. You can click the button below to
              <Box as="a" href="" target="_blank">
                check the listing or check on explorer.
              </Box>
            </Text>
          </Box>
        ),
        buttonText: 'View Listing',
      });

      // refetch object status
      await refetchListStatus();
    },
  });

  const { data: usdExchange, isLoading: usdExchangeIsLoading } =
    useGetBnbUsdtExchangeRate();

  const totalFees = useMemo(() => {
    if (totalFee.length === 0) return BigInt(0);
    return totalFee?.reduce((a, b) => a + b);
  }, [totalFee]);

  const BSC_FEE_SUFF = useMemo(() => {
    if (!BscBalanceVal) return false;
    return BscBalanceVal.value >= totalFees;
  }, [BscBalanceVal, totalFees]);

  const usd = useMemo(() => {
    if (!usdExchange) return '0';
    return formatEther(BigInt(parseInt(usdExchange)) * totalFees);
  }, [totalFees, usdExchange]);

  return (
    <QDrawer
      w="380px"
      color="#f7f7f8"
      isOpen={listInfo.open}
      onClose={() => {
        reset();
      }}
      closeOnOverlayClick={false}
    >
      <QDrawerCloseButton />
      <Header>Approve Listing</Header>
      <CustomBody>
        <InfoCon gap={26} direction="column">
          <ImgCon>
            <img src={listInfo.data.imageUrl} alt="" />
          </ImgCon>
          <Box fontSize="14px" color="#C4C5CB">
            {listInfo.data.desc}
          </Box>
          <Flex alignItems={'center'} color="#F7F7F8" fontSize="16px" gap="8px">
            <Flex gap="4px" alignItems="center">
              <BSCIcon />
              <Box>{formatEther(totalFees)} BNB</Box>
            </Flex>
            <Box fontSize="14px" color="#C4C5CB">
              $ {usdExchangeIsLoading ? '0' : usd}
            </Box>
          </Flex>
        </InfoCon>
      </CustomBody>

      <QDrawerFooter>
        <Flex flexDirection={'column'} gap={6} w="100%">
          <Stack
            mb="24px"
            color="#F7F7F8"
            pos="relative"
            sx={{
              '.line': {
                w: '1px',
                h: '30px',
                bg: '#373943',
                pos: 'absolute',
                left: '4px',
                top: '13px',
              },
              '&> .item': {
                pos: 'relative',
                pl: '20px',
                my: '7px',
                fontSize: '14px',
                fontWeight: 600,
              },
              '&>.item:before': {
                content: '""',
                display: 'block',
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                position: 'absolute',
                left: 0,
                top: '5px',
              },
              '&>.approve:before': {
                background: isApproved ? '#F7F7F8' : '#373943',
              },

              '&>.list': {
                color: '#8C8F9B',
              },
              '&>.list:before': {
                background: '#373943',
              },
            }}
          >
            <Box className="line" />
            <Box className="item approve">Approve</Box>
            <Box className="item list">List on BSC</Box>
          </Stack>

          {!BSC_FEE_SUFF && (
            <BalanceWarn>
              <ColoredWarningIcon size="sm" color="#ff6058" mr="4px" />{' '}
              Insufficient BSC Balance
            </BalanceWarn>
          )}

          {chain && chain.id !== BSC_CHAIN.id && (
            <Button
              bg="#FFA260"
              h="48px"
              color="#181A1E"
              fontWeight={700}
              onClick={() => {
                switchNetwork?.(BSC_CHAIN.id);
              }}
            >
              <ReverseVIcon />
              Switch to BSC Network
            </Button>
          )}

          {chain && chain.id === BSC_CHAIN.id && (
            <YellowButton
              borderRadius="8px"
              h="48px"
              onClick={async () => {
                await doList();

                setListInfo((draft) => {
                  draft.open = false;
                });
              }}
              isLoading={listStart}
              loadingText={<Loader size={30} />}
              disabled={!BSC_FEE_SUFF || listStart}
            >
              {isApproved ? 'List' : 'Approve'}
            </YellowButton>
          )}
        </Flex>
      </QDrawerFooter>
    </QDrawer>
  );
};

const Header = styled(QDrawerHeader)`
  font-style: normal;
  font-weight: 800;
  font-size: 20px;
  line-height: 28px;

  display: flex;
  align-items: center;
  text-align: center;

  color: #f7f7f8;
`;

const CustomBody = styled(QDrawerBody)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const InfoCon = styled(Flex)``;

const ImgCon = styled.div`
  width: 145px;
  img {
    background: #d9d9d9;
    border-radius: 8px;
  }
`;

const BalanceWarn = styled(Flex)`
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 18px;
  /* identical to box height, or 180% */

  color: #ff6058;
`;
