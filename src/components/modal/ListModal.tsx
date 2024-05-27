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
  Text,
} from '@totejs/uikit';
import { useImmerAtom } from 'jotai-immer';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Address, formatEther } from 'viem';
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from 'wagmi';
import { listAtom } from '../../atoms/listAtom';
import { BSC_CHAIN, BSC_EXPLORER_URL } from '../../env';
import { useGetBnbUsdtExchangeRate } from '../../hooks/price/useGetBnbUsdtExchangeRate';
import { useList } from '../../hooks/seller/useList';
import { useGetObjInBucketListStatus } from '../../hooks/useGetObjInBucketListStatus';
import { getSpaceName } from '../../utils/space';
import { Loader } from '../Loader';
import { UPLOAD_LIST_PAGE_SIZE } from '../profile/MyCollectionList';
import BSCIcon from '../svgIcon/BSCIcon';
import { YellowButton } from '../ui/buttons/YellowButton';
import { Tips } from './Tips';
import { useGetCategory } from '../../hooks/apis/useGetCatoriesMap';

export const ListModal = () => {
  const navigator = useNavigate();
  const [listInfo, setListInfo] = useImmerAtom(listAtom);
  const { address } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { data: BscBalanceVal } = useBalance({
    chainId: BSC_CHAIN.id,
    address,
  });

  // const { data: categories } = useGetCatoriesMap();

  const { chain } = useNetwork();
  const { refetch: refetchList } = useGetObjInBucketListStatus(
    getSpaceName(address),
    UPLOAD_LIST_PAGE_SIZE,
  );

  // const { refetch: refetchListStatus } = useGetItemByObjId(
  //   String(listInfo.data.objectId),
  // );

  const reset = useCallback(() => {
    setListInfo((draft) => {
      draft.open = false;
    });
  }, [setListInfo]);

  const onSuccessModal = async (listHash?: Address) => {
    NiceModal.show(Tips, {
      title: ``,
      content: (
        <Box>
          <img
            style={{
              height: '100px',
              width: '100%',
              objectFit: 'contain',
              cursor: 'pointer',
            }}
            src={listInfo.data.imageUrl}
            onClick={() => {
              window.open(listInfo.data.imageUrl);
            }}
          />
          <Text
            as="h2"
            fontSize="24px"
            mt="20px"
            mb="8px"
            color="#181A1E"
            fontWeight={900}
          >
            Your item has been listed!
          </Text>
          <Text fontSize="14px" color="#76808F">
            <Box as="span" color="#1184EE">
              {listInfo.data.name}
            </Box>{' '}
            has been listed on MindPress. You can click the button below to
            check the listing or check on{' '}
            <a
              href={`${BSC_EXPLORER_URL}tx/${listHash}`}
              target="_blank"
              style={{
                color: '#1184EE',
              }}
            >
              explorer
            </a>
            .
          </Text>
        </Box>
      ),
      buttonText: 'View Listing',
      buttonClick: async () => {
        // refetch listed list
        await refetchList();

        // refetch object status
        // await refetchListStatus();

        navigator(`/profile?tab=uploaded`);
      },
    });
  };

  const {
    // isApproved,
    doList,
    start: listStart,
    totalFee,
  } = useList({
    data: {
      bucketId: listInfo.data.bucketId,
      objectId: listInfo.data.objectId,
      objectPrice: listInfo.data.price,
      categoryId: BigInt(listInfo.data.categoryId),
      desc: listInfo.data.desc,
      imageUrl: listInfo.data.imageUrl,
    },
    onSuccess: async (listHash) => {
      await onSuccessModal(listHash);
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

  const category = useGetCategory(Number(listInfo.data.categoryId));

  // const totalFeesUsd = useMemo(() => {
  //   if (!usdExchange) return '0';
  //   return formatEther(BigInt(parseInt(usdExchange)) * totalFees);
  // }, [totalFees, usdExchange]);

  const priceUsd = useMemo(() => {
    if (!usdExchange) return '0';
    return formatEther(BigInt(parseInt(usdExchange)) * listInfo.data.price);
  }, [listInfo.data.price, usdExchange]);

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
      <Header>List Photo</Header>
      <CustomBody>
        <InfoCon gap={26} direction="column">
          <ImgCon>
            <img src={listInfo.data.imageUrl} alt="" />
          </ImgCon>
          <Box
            fontSize="16px"
            lineHeight="24px"
            fontWeight={600}
            color="#F7F7F8"
          >
            {listInfo.data.name}
          </Box>
          {listInfo.data.desc && (
            <Box fontSize="14px" color="#C4C5CB">
              {listInfo.data.desc}
            </Box>
          )}
          <Box>
            <Box
              as="span"
              bg="#373943"
              color="#C4C5CB"
              padding="4px 8px"
              fontSize="12px"
              borderRadius="40px"
            >
              {category?.name}
            </Box>
          </Box>
          <Flex alignItems={'center'} color="#F7F7F8" fontSize="16px" gap="8px">
            {/* <Flex gap="4px" alignItems="center">
              <BSCIcon />
              <Box>{formatEther(totalFees)} BNB</Box>
            </Flex> */}
            {/* <Box fontSize="14px" color="#C4C5CB">
              $ {usdExchangeIsLoading ? '0' : usd}
            </Box> */}
            <Flex gap="4px" alignItems="center">
              <BSCIcon />
              <Box>{formatEther(listInfo.data.price)} BNB</Box>
            </Flex>
            <Box fontSize="14px" color="#C4C5CB">
              $ {usdExchangeIsLoading ? '0' : priceUsd}
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

          {chain && chain.id !== BSC_CHAIN.id && (
            <Button
              bg="#FFA260"
              _hover={{
                bg: '#FF8A38',
              }}
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
              loadingText={
                <Flex
                  w="100%"
                  alignItems="center"
                  justifyContent="center"
                  gap="5px"
                >
                  <Box w="35px">
                    <Loader
                      minHeight={43}
                      size={20}
                      borderWidth={2}
                      color="#E6E8EA"
                      bg="#76808F"
                    />
                  </Box>
                  <Box>Transaction in progress</Box>
                </Flex>
              }
              disabled={!BSC_FEE_SUFF || listStart}
              _disabled={{
                bg: '#F7F7F873',
                cursor: 'not-allowed',
                _hover: {
                  bg: '#F7F7F873',
                },
              }}
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
