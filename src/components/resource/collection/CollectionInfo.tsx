import styled from '@emotion/styled';
import { Box, Button, Flex } from '@totejs/uikit';
import BN from 'bn.js';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { Link } from 'react-router-dom';
import { useBNBPrice } from '../../../hooks/useBNBPrice';
import { ITEM_STATUS } from '../../../hooks/useItemStatus';
import { useModal } from '../../../hooks/useModal';
import {
  divide10Exp,
  formatDateUTC,
  parseFileSize,
  roundFun,
  trimLongStr,
} from '../../../utils';
import BSCIcon from '../../svgIcon/BSCIcon';
import { SizeIcon } from '../../svgIcon/SizeIcon';
import { CategoryIcon } from '../../svgIcon/CategoryIcon';
import { CalendarIcon } from '@totejs/icons';
import { ShoppingIcon } from '../../svgIcon/ShoppingIcon';
import { useCollectionItems } from '../../../hooks/useCollectionItems';
import { CountIcon } from '../../svgIcon/CountIcon';

interface Props {
  collection: {
    path: string;
    name: string;
    query: string;
  };
  ownerAddress: string;
  fileSize: number;
  categoryId: number;
  createdAt: number;
  salesVolume: number;
  itemStatus: ITEM_STATUS;
  price: string;
  listed: boolean;
  baseInfo: any;
  name: string;
}

export const CollectionInfo = (props: Props) => {
  const {
    name,
    collection,
    ownerAddress,
    fileSize,
    baseInfo,
    categoryId,
    createdAt,
    salesVolume,
    itemStatus,
    price,
    listed,
  } = props;

  const { price: bnbPrice } = useBNBPrice();

  const { list, loading } = useCollectionItems(name, listed);
  // console.log(`${collection.path}${collection.query}?${collection.query}`);

  // const categoryies = useGetCatoriesMap();
  // const category = categoryies.data?.find((c) => c.id === categoryId);

  // console.log('category', category, categoryId);

  const modalData = useModal();

  return (
    <Box>
      <Flex mt="16px" mb="32px" alignItems="center">
        <Box color="#F7F7F8" fontSize="16px" fontWeight="600">
          <Link to={`${collection.path}?${collection.query || ''}`}>
            {collection?.name?.replace('+', ' ')}
          </Link>
        </Box>
        <Box fontWeight="16px" color="#C4C5CB" ml="8px" mr="16px">
          created by
        </Box>
        <Flex
          bg="#1E2026"
          border="1px solid #373943"
          borderRadius="16px"
          p="8px"
        >
          <Link to={`/profile?address=${ownerAddress}`}>
            <Flex alignItems="center">
              <MetaMaskAvatar address={ownerAddress} />
              <Box as="p" ml="8px">
                {trimLongStr(ownerAddress)}
              </Box>
            </Flex>
          </Link>
        </Flex>
      </Flex>

      <FieldList justifyContent="space-between">
        <FlexCon flex={1} justifyContent="space-between" mr="10px">
          <Block>
            <Value>{list.length}</Value>
            <Field>
              <CountIcon /> Item count
            </Field>
          </Block>
          <Block>
            <Value>{/* {category?.name} */} Uncategorized </Value>
            <Field>
              <CategoryIcon /> Category{' '}
            </Field>
          </Block>
        </FlexCon>

        <FlexCon flex={1} justifyContent="space-between" ml="10px">
          <Block>
            <Value>{formatDateUTC(createdAt * 1000)}</Value>
            <Field>
              <CalendarIcon /> Created
            </Field>
          </Block>
          <Block>
            <Value>{salesVolume}</Value>
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

          {itemStatus === 'NOT_PURCHASED_BY_ME' && listed && (
            <Box>
              <Button
                color="#FFE900"
                background="#665800"
                onClick={() => {
                  modalData.modalDispatch({
                    type: 'OPEN_BUY',
                    buyData: baseInfo,
                  });
                }}
              >
                Buy
              </Button>
            </Box>
          )}

          {itemStatus !== 'NOT_PURCHASED_BY_ME' && (
            <Box>
              <Button
                color="#FFE900"
                background="#665800"
                onClick={() => {
                  // ...
                  document.documentElement.scrollTop = 500;
                }}
              >
                Get My Data
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
