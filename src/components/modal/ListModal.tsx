import styled from '@emotion/styled';
import { ColoredWarningIcon } from '@totejs/icons';
import {
  Box,
  Button,
  Flex,
  QDrawer,
  QDrawerBody,
  QDrawerCloseButton,
  QDrawerFooter,
  QDrawerHeader,
} from '@totejs/uikit';
import { useImmerAtom } from 'jotai-immer';
import { useCallback, useMemo } from 'react';
import { formatEther } from 'viem';
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from 'wagmi';
import { listAtom } from '../../atoms/listAtom';
import { BSC_CHAIN } from '../../env';
import { useList } from '../../hooks/seller/useList';
import { useGetBnbUsdtExchangeRate } from '../../hooks/useGetBnbUsdtExchangeRate';
import BSCIcon from '../svgIcon/BSCIcon';
import { YellowButton } from '../ui/buttons/YellowButton';

// interface ListModalProps {
//   // isOpen: boolean;
//   // handleOpen: (show: boolean) => void;
//   // detail: any;
// }

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
  console.log('chain', chain);

  const reset = useCallback(() => {
    setListInfo((draft) => {
      draft.open = false;
    });
    // setPrice('');
    // setDesc('');
    // setImgUrl('');
    // setCategory('');
    // handleOpen(false);
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
  });

  const { data: usdExchange, isLoading: usdExchangeIsLoading } =
    useGetBnbUsdtExchangeRate();

  const totalFees = useMemo(() => {
    if (totalFee.length === 0) return BigInt(0);
    return totalFee?.reduce((a, b) => a + b);
  }, [totalFee]);
  console.log(
    'totalFee',
    formatEther(totalFees),
    BigInt(parseInt(usdExchange)),
  );

  const BSC_FEE_SUFF = useMemo(() => {
    if (!BscBalanceVal) return false;
    return BscBalanceVal.value >= totalFees;
  }, [BscBalanceVal, totalFees]);

  const usd = formatEther(BigInt(parseInt(usdExchange)) * totalFees);

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
          {!BSC_FEE_SUFF && (
            <BalanceWarn>
              <ColoredWarningIcon size="sm" color="#ff6058" mr="4px" />{' '}
              Insufficient BSC Balance
            </BalanceWarn>
          )}

          {chain && chain.id === BSC_CHAIN.id && (
            <YellowButton
              borderRadius="8px"
              h="48px"
              onClick={async () => {
                await doList();
              }}
              isLoading={listStart}
              disabled={!BSC_FEE_SUFF || listStart}
            >
              List
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
