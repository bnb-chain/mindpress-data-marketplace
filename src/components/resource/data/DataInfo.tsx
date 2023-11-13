import styled from '@emotion/styled';
import { CalendarIcon } from '@totejs/icons';
import { Box, Button, Flex } from '@totejs/uikit';
import BN from 'bn.js';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useBNBPrice } from '../../../hooks/useBNBPrice';
import { useGetItemRelationWithAddr } from '../../../hooks/useGetItemRelationWithAddr';
import { useModal } from '../../../hooks/useModal';
import { useWalletModal } from '../../../hooks/useWalletModal';
import {
  divide10Exp,
  formatDateDot,
  parseFileSize,
  roundFun,
  trimLongStr,
} from '../../../utils';
import { Item } from '../../../utils/apis/types';
import { QueryHeadObjectResponse } from '../../../utils/gfSDK';
import { NoData } from '../../NoData';
import BSCIcon from '../../svgIcon/BSCIcon';
import { CategoryIcon } from '../../svgIcon/CategoryIcon';
import { ShoppingIcon } from '../../svgIcon/ShoppingIcon';
import { SizeIcon } from '../../svgIcon/SizeIcon';
import { useGetCategory } from '../../../hooks/useGetCatoriesMap';

interface Props {
  itemInfo: Item;
  objectData?: QueryHeadObjectResponse;
}

export const DataInfo = (props: Props) => {
  const { itemInfo, objectData } = props;

  const { price, ownerAddress, createdAt } = itemInfo;

  const { address, isConnected, isConnecting } = useAccount();
  const { price: bnbPrice } = useBNBPrice();
  const relation = useGetItemRelationWithAddr(address, itemInfo);

  const modalData = useModal();
  const { handleModalOpen } = useWalletModal();
  console.log(itemInfo.categoryId);

  const categroyInfo = useGetCategory(itemInfo.categoryId);

  if (!objectData || !itemInfo) {
    return <NoData size={300} />;
  }

  return (
    <Box>
      <Flex mt="16px" mb="32px" alignItems="center">
        <Box color="#F7F7F8" fontSize="16px" fontWeight="600">
          {/* <Link to={`${collection.path}?${collection.query || ''}`}>
            {collection?.name?.replace('+', ' ')}
          </Link> */}
        </Box>
        <Box fontWeight="16px" color="#C4C5CB" ml="8px" mr="16px">
          created by
        </Box>
        <Link to={`/profile?address=${ownerAddress}`}>
          <Flex
            bg="#1E2026"
            border="1px solid #373943"
            borderRadius="16px"
            p="8px"
            _hover={{
              background: '#373943',
            }}
          >
            <Flex alignItems="center">
              <MetaMaskAvatar address={ownerAddress} />
              <Box as="p" ml="8px">
                {trimLongStr(ownerAddress)}
              </Box>
            </Flex>
          </Flex>
        </Link>
      </Flex>

      <FieldList justifyContent="space-between">
        <FlexCon flex={1} justifyContent="space-between" mr="10px">
          <Block>
            <Value>
              {parseFileSize(objectData.objectInfo.payloadSize.low)}
            </Value>
            <Field>
              <SizeIcon /> Size
            </Field>
          </Block>
          <Block>
            {/* <Value> {categroyInfo?.name} </Value> */}
            <Field>
              <CategoryIcon /> Category
            </Field>
          </Block>
        </FlexCon>

        <FlexCon flex={1} justifyContent="space-between" ml="10px">
          <Block>
            <Value>{formatDateDot(createdAt * 1000)}</Value>
            <Field>
              <CalendarIcon /> Created
            </Field>
          </Block>
          <Block>
            <Value>{itemInfo.totalSale || 0}</Value>
            <Field>
              <ShoppingIcon /> Purchased
            </Field>
          </Block>
        </FlexCon>
      </FieldList>

      <Box mt="50px">
        <ActionBox>
          <Flex alignItems="center" justifyContent="space-between">
            <Box p="8px" bg="#373943" borderRadius="32px" mr="8px">
              <BSCIcon color="#F0B90B" w={16} h={16} />
            </Box>

            <Flex gap="8px" alignItems="center">
              <BNB>{divide10Exp(new BN(price, 10), 18)} BNB</BNB>
              <Dollar>
                $
                {roundFun(
                  divide10Exp(
                    new BN(price, 10).mul(new BN(Number(bnbPrice), 10)),
                    18,
                  ).toString(),
                  8,
                )}
              </Dollar>
            </Flex>
          </Flex>

          {(relation === 'NOT_PURCHASE' || relation === 'UNKNOWN') && (
            <Box>
              <Button
                color="#FFE900"
                background="#665800"
                onClick={() => {
                  console.log('relation', relation, isConnecting, isConnected);
                  if (relation === 'UNKNOWN') {
                    if (!isConnected && !isConnecting) {
                      handleModalOpen();
                    }
                  } else {
                    modalData.modalDispatch({
                      type: 'OPEN_BUY',
                      buyData: itemInfo,
                    });
                  }
                }}
              >
                Buy
              </Button>
            </Box>
          )}
        </ActionBox>
      </Box>
    </Box>
  );
};

const Value = styled(Box)`
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: #f7f7f8;
`;

const Field = styled(Flex)`
  align-items: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: #8c8f9b;
  margin-top: 10px;
  gap: 4px;
`;

const Block = styled(Box)`
  flex: 1;
  padding: 20px 0;
  border-top: 1px solid #373943;
  border-bottom: 1px solid #373943;
`;

const FieldList = styled(Flex)`
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 50%;
    width: 1px;
    height: 80%;
    background-color: #373943;
  }
`;

const FlexCon = styled(Flex)``;

const ActionBox = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 32px;
  background: #1e2026;
  border-radius: 16px;
  box-shadow: 0px 16px 48px 0px rgba(0, 0, 0, 0.16);
`;

const BNB = styled(Box)`
  color: #c4c5cb;
  font-size: 24px;
  font-weight: 600;
`;

const Dollar = styled(Box)`
  color: #c4c5cb;
  font-size: 14px;
`;
