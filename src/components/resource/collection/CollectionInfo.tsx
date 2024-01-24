import styled from '@emotion/styled';
import { useModal as useWalletKitModal } from '@node-real/walletkit';
import { CalendarIcon } from '@totejs/icons';
import { Box, Flex } from '@totejs/uikit';
import BN from 'bn.js';
import { MetaMaskAvatar } from 'react-metamask-avatar';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useBNBPrice } from '../../../hooks/useBNBPrice';
import { useGetCategory } from '../../../hooks/useGetCatoriesMap';
import { ITEM_RELATION_ADDR } from '../../../hooks/useGetItemRelationWithAddr';
import { useGetObjectList } from '../../../hooks/useGetObjectList';
import { useModal } from '../../../hooks/useModal';
import {
  divide10Exp,
  formatDateDot,
  roundFun,
  trimLongStr,
} from '../../../utils';
import { Item } from '../../../utils/apis/types';
import { Loader } from '../../Loader';
import BSCIcon from '../../svgIcon/BSCIcon';
import { CategoryIcon } from '../../svgIcon/CategoryIcon';
import { CountIcon } from '../../svgIcon/CountIcon';
import { FolderIcon } from '../../svgIcon/FolderIcon';
import { ShoppingIcon } from '../../svgIcon/ShoppingIcon';
import { BigYellowButton } from '../../ui/buttons/YellowButton';
import { useSetAtom } from 'jotai';
import { buyAtom } from '../../../atoms/buyAtom';
import { useImmerAtom } from 'jotai-immer';

interface Props {
  itemInfo: Item;
  relation: ITEM_RELATION_ADDR;
}

export const CollectionInfo = (props: Props) => {
  const { itemInfo, relation } = props;
  const [p] = useSearchParams();
  const { price: bnbPrice } = useBNBPrice();
  const path = p.get('path') as string;
  const { isConnected, isConnecting } = useAccount();
  const { onOpen } = useWalletKitModal();
  const navigator = useNavigate();
  const [, setBuy] = useImmerAtom(buyAtom);

  const categroyInfo = useGetCategory(itemInfo.categoryId);

  const { data: objectList, isLoading } = useGetObjectList({
    bucketName: itemInfo?.name,
    path: path,
  });

  const modalData = useModal();

  return (
    <Box>
      <Flex mt="16px" mb="32px" alignItems="center">
        <Box color="#F7F7F8" fontSize="16px" fontWeight="600">
          <FolderIcon color="#8C8F9B" mr="5px" />
          {/* <Link to={`/resource?id=${itemInfo.id}&path=/`}> */}
          <Box as="span">Collection</Box>
          {/* </Link> */}
        </Box>
        <Box fontWeight="16px" color="#C4C5CB" ml="8px" mr="16px">
          created by
        </Box>
        <Link to={`/profile?address=${itemInfo.ownerAddress}`}>
          <Flex
            bg="#1E2026"
            border="1px solid #373943"
            borderRadius="24px"
            p="8px"
            _hover={{
              background: '#373943',
            }}
          >
            <Flex alignItems="center">
              <MetaMaskAvatar address={itemInfo.ownerAddress} />
              <Box as="p" ml="8px">
                {trimLongStr(itemInfo.ownerAddress)}
              </Box>
            </Flex>
          </Flex>
        </Link>
      </Flex>

      <FieldList justifyContent="space-between">
        <FlexCon flex={1} justifyContent="space-between" mr="10px">
          <Block>
            <Value>
              {isLoading ? (
                <Loader
                  style={{
                    width: '10px',
                    height: '10px',
                  }}
                  minHeight={32}
                  size={10}
                />
              ) : (
                objectList?.length
              )}
            </Value>
            <Field>
              <CountIcon /> Item count
            </Field>
          </Block>
          <Block>
            <Value>{categroyInfo?.name} </Value>
            <Field>
              <CategoryIcon /> Category
            </Field>
          </Block>
        </FlexCon>

        <FlexCon flex={1} justifyContent="space-between" ml="10px">
          <Block>
            <Value>{formatDateDot(itemInfo.createdAt * 1000)}</Value>
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
              <BSCIcon color="#F0B90B" w={22} h={22} />
            </Box>

            <Flex gap="8px" alignItems="baseline">
              <BNB>{divide10Exp(new BN(itemInfo.price, 10), 18)} BNB</BNB>
              <Dollar>
                $
                {roundFun(
                  divide10Exp(
                    new BN(itemInfo.price, 10).mul(
                      new BN(Number(bnbPrice), 10),
                    ),
                    18,
                  ).toString(),
                  8,
                )}
              </Dollar>
            </Flex>
          </Flex>

          {(relation === 'NOT_PURCHASE' || relation === 'UNKNOWN') && (
            <Box>
              <BigYellowButton
                onClick={() => {
                  if (!isConnected && !isConnecting) {
                    onOpen();
                  } else {
                    setBuy((draft) => {
                      draft.openDrawer = true;
                      draft.buying = false;
                      draft.buyData = itemInfo;
                    });
                  }
                }}
              >
                Buy
              </BigYellowButton>
            </Box>
          )}

          {relation === 'OWNER' && (
            <Box>
              <BigYellowButton
                onClick={() => {
                  modalData.modalDispatch({
                    type: 'OPEN_DELIST',
                    delistData: {
                      groupId: itemInfo.groupId,
                      bucket_name: itemInfo.name,
                      create_at: itemInfo.createdAt,
                      owner: itemInfo.ownerAddress,
                    },
                    callBack: () => {
                      navigator(`/profile?tab=collections`);
                    },
                  });
                }}
              >
                Delist
              </BigYellowButton>
            </Box>
          )}
        </ActionBox>
      </Box>
    </Box>
  );
};

const Value = styled(Box)`
  font-size: 20px;
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
  color: #f7f7f8;
  font-size: 14px;
`;
