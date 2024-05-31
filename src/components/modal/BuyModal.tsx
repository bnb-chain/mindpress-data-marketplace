import styled from '@emotion/styled';
import { ColoredInfoIcon } from '@totejs/icons';
import {
  Box,
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
  QDrawer,
  QDrawerBody,
  QDrawerCloseButton,
  QDrawerFooter,
  QDrawerHeader,
  Stack,
} from '@totejs/uikit';
import { BN } from 'bn.js';
import { useImmerAtom } from 'jotai-immer';
import { useMemo } from 'react';
import { formatEther, formatUnits, parseUnits } from 'viem';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { buyAtom } from '../../atoms/buyAtom';
import { BSC_CHAIN, NETWORK, NET_ENV } from '../../env';
import { useBuy } from '../../hooks/buyer/useBuy';
import { useBNBPrice } from '../../hooks/price/useBNBPrice';
import { useChainBalance } from '../../hooks/price/useChainBalance';
import { divide10Exp, roundFun } from '../../utils';
import { Loader } from '../Loader';
import { BigYellowButton } from '../ui/buttons/YellowButton';
import { InsufficientBSC } from './InsufficientBSC';

export const BuyModal = () => {
  const [buys, setBuys] = useImmerAtom(buyAtom);

  const { groupId, price, groupName, ownerAddress } = buys.buyData;

  // console.log('buys', buys.buyData);

  const { buy, relayFee } = useBuy(groupName, ownerAddress, price);

  const { BscBalanceVal } = useChainBalance();
  const { price: bnbPrice } = useBNBPrice();

  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const priceBNB = useMemo(() => {
    const balance = divide10Exp(new BN(price, 10), 18);
    return balance;
  }, [price]);

  const earing = useMemo(() => {
    // 20: * 0.01
    return divide10Exp(new BN(price, 10), 20);
  }, [price]);

  const relayFeeBNB = useMemo(() => {
    // return relayFee;
    // const balance = divide10Exp(new BN(relayFee, 10), 18);
    // return balance;
    return formatEther(relayFee);
  }, [relayFee]);

  const TotalPrice = useMemo(() => {
    return roundFun(Number(priceBNB) + Number(earing) + Number(relayFeeBNB), 6);
  }, [earing, priceBNB, relayFeeBNB]);

  const BSC_FEE_SUFF = useMemo(() => {
    return Number(BscBalanceVal) >= TotalPrice;
  }, [BscBalanceVal, TotalPrice]);

  const totalDollar = useMemo(() => {
    const fee =
      parseUnits(String(TotalPrice), 9) * parseUnits(String(bnbPrice), 9);

    return formatUnits(fee, 18);
  }, [TotalPrice, bnbPrice]);

  return (
    <Container
      isOpen={buys.openDrawer}
      onClose={() => {
        setBuys((draft) => {
          draft.openDrawer = false;
          draft.buying = false;
        });
      }}
      background={'#1e2026'}
      color="#FFF"
      w="380px"
    >
      <QDrawerCloseButton color="#C4C5CB" w="28px" h="28px" top="31px" />
      <Header>Order Summary</Header>
      <CustomBody>
        <BuyInfo>
          <ItemCon justifyContent={'space-between'}>
            <ItemTitle>Price</ItemTitle>
            <ItemVal>{priceBNB} BNB</ItemVal>
          </ItemCon>
          <ItemCon justifyContent={'space-between'}>
            <ItemTitle>
              Service fee
              <Popover placement="right" trigger="hover">
                <PopoverTrigger trigger="hover">
                  <ColoredInfoIcon
                    ml="3px"
                    color="#8C8F9B"
                    w="16px"
                    cursor="pointer"
                  />
                </PopoverTrigger>
                <PopoverContent p="0">
                  <PopoverArrow bg="#F7F7F8" />
                  <Box bg="#F7F7F8" borderRadius="4px" p="8px" color="#181A1E">
                    Price x 1%
                  </Box>
                </PopoverContent>
              </Popover>
            </ItemTitle>
            <ItemVal>{earing} BNB</ItemVal>
          </ItemCon>
          <ItemCon justifyContent={'space-between'}>
            <ItemTitle>Gas fee</ItemTitle>
            <ItemVal>{relayFeeBNB} BNB</ItemVal>
          </ItemCon>
          <Box w="100%" h="1px" bg="#5C5F6A"></Box>
          <ItemCon alignItems={'flex-start'} justifyContent={'space-between'}>
            <ItemTitle>Total</ItemTitle>
            <ItemVal>
              <Box>{TotalPrice} BNB</Box>
              <Box textAlign="right" color="#8C8F9B" fontSize="12px">
                ${totalDollar}
              </Box>
            </ItemVal>
          </ItemCon>
          {/* <ItemCon alignItems={'flex-end'} justifyContent={'space-between'}>
            <ItemTitle>Balance on BSC {NETWORK}</ItemTitle>
            <ItemVal> {roundFun(BscBalanceVal, 4)} BNB </ItemVal>
          </ItemCon> */}
        </BuyInfo>
      </CustomBody>

      <QDrawerFooter>
        <Stack gap="10px">
          {!BSC_FEE_SUFF && <InsufficientBSC />}

          {chain && chain.id === BSC_CHAIN.id && (
            <BigYellowButton
              w="100%"
              isLoading={buys.buying}
              _disabled={{
                bg: '#F7F7F873',
                cursor: 'not-allowed',
                _hover: {
                  bg: '#F7F7F873',
                },
              }}
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
              onClick={async () => {
                // await buy(2479);
                console.log('groupId', groupId);
                buy(groupId);

                setBuys((draft) => {
                  draft.openDrawer = true;
                  draft.buying = true;
                });
              }}
              disabled={!BSC_FEE_SUFF || buys.buying}
            >
              Buy
            </BigYellowButton>
          )}

          {chain && chain.id !== BSC_CHAIN.id ? (
            <Button
              w="100%"
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
              Switch to BSC {NETWORK}
            </Button>
          ) : null}
        </Stack>
      </QDrawerFooter>
    </Container>
  );
};

const Container = styled(QDrawer)`
  /* color: red; */
`;

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

const BuyInfo = styled(Stack)`
  /* margin-top: 60px; */
  gap: 12px;
`;

const ItemCon = styled(Flex)`
  font-size: 14px;
  line-height: 16px;
`;

const ItemTitle = styled.div`
  font-style: normal;
  font-weight: 600;
  line-height: 18px;

  color: #c4c5cb;
`;

const ItemVal = styled.div`
  font-weight: 700;
  line-height: 18px;
  color: #f7f7f8;
`;
