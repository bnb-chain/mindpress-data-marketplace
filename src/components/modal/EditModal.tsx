import styled from '@emotion/styled';
import { ColoredWarningIcon } from '@totejs/icons';
import {
  Box,
  Flex,
  Input,
  toast,
  Textarea,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@totejs/uikit';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
} from '@totejs/uikit';
import { ForwardedRef, ReactNode, forwardRef, useMemo, useState } from 'react';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { GF_CHAIN_ID } from '../../env';
import { useChainBalance } from '../../hooks/useChainBalance';
import { useEdit } from '../../hooks/useEdit';
import { Loader } from '../Loader';
import { roundFun } from '../../utils';
import { Item } from '../../utils/apis/types';
import { QueryHeadGroupResponse } from '../../utils/gfSDK';
import { useGetItemById } from '../../hooks/useGetItemById';
import { useGetGroupByName } from '../../hooks/useGetBucketOrObj';
import {
  useGetCategory,
  useGetCatoriesMap,
} from '../../hooks/useGetCatoriesMap';

interface ListModalProps {
  isOpen: boolean;
  handleOpen: (show: boolean) => void;
  itemInfo: Item;
  groupData?: QueryHeadGroupResponse;
}

export const EditModal = (props: ListModalProps) => {
  const { isOpen, handleOpen, itemInfo } = props;

  const { refetch } = useGetItemById(itemInfo.id);

  const { switchNetwork } = useSwitchNetwork();
  const { GfBalanceVal } = useChainBalance();

  const { chain } = useNetwork();

  // const { name, type, desc: _desc, url, groupName, extra } = detail;

  const { data: groupData } = useGetGroupByName(
    itemInfo.groupName,
    itemInfo.ownerAddress,
  );

  const { address } = useAccount();

  const [desc, setDesc] = useState(itemInfo.description);
  const [imgUrl, setImgUrl] = useState(itemInfo.url || '');

  const { data: categories } = useGetCatoriesMap();
  const defaultCategory = useGetCategory(itemInfo.categoryId);
  const [category, setCategory] = useState(
    defaultCategory?.name || 'Uncategorized',
  );

  const [loading, setLoading] = useState(false);

  const onChangeDesc = (event: any) => {
    setDesc(event.target.value);
  };
  const onChangeImgUrl = (event: any) => {
    setImgUrl(event.target.value);
  };

  const onChangeCategory = (v: string) => {
    setCategory(v);
  };

  const INFO_NO_CHANGE = useMemo(() => {
    return desc === itemInfo.description && imgUrl === itemInfo.url;
  }, [desc, imgUrl, itemInfo.description, itemInfo.url]);

  const extraStr = useMemo(() => {
    if (!groupData) return '';

    // console.log('groupData?.groupInfo.extra', groupData?.groupInfo.extra);
    // console.log('hr,', imgUrl);

    return JSON.stringify({
      ...JSON.parse(groupData?.groupInfo.extra),
      desc,
      url: imgUrl,
      category,
    });
  }, [category, desc, groupData, imgUrl]);

  // console.log('GroupData', groupData);
  const { edit, simulateInfo, simLoading } = useEdit(
    address as string,
    itemInfo.groupName,
    extraStr,
  );

  // console.log('GfBalanceVal', GfBalanceVal, simulateInfo);

  const GF_FEE_SUFF = useMemo(() => {
    if (simulateInfo) {
      return GfBalanceVal >= Number(simulateInfo.gasFee);
    }
    return false;
  }, [simulateInfo, GfBalanceVal]);

  return (
    <Container
      size={'lg'}
      isOpen={isOpen}
      onClose={() => {
        handleOpen(false);
      }}
      closeOnOverlayClick={false}
    >
      <ModalCloseButton />
      <Header> Edit </Header>
      <CustomBody>
        <Box h={10}></Box>
        <ResourceNameCon alignItems={'center'}>
          {itemInfo.name}
          {itemInfo.type === 'COLLECTION' ? (
            <Tag justifyContent={'center'} alignItems={'center'}>
              Data collection
            </Tag>
          ) : null}
        </ResourceNameCon>
        <Box h={32}></Box>
        <ItemTittle alignItems={'center'} justifyContent={'space-between'}>
          Description
          {/* {itemInfo && (
            <span>
              Markdown syntax is supported. {itemInfo.description.length} of 300
              characters used.
            </span>
          )} */}
        </ItemTittle>
        <Box h={10}></Box>
        <InputCon>
          <Textarea
            value={desc}
            onChange={onChangeDesc}
            placeholder="Please enter an description..."
            maxLength={300}
          />
        </InputCon>
        <Box h={10}></Box>
        <ItemTittle alignItems={'center'} justifyContent={'space-between'}>
          Category
        </ItemTittle>
        <InputCon>
          <Menu>
            <MenuButton as={CustomMenuButton}>Select...</MenuButton>
            <MenuList h="200px" bg="#FFF" overflow="scroll" fontSize="12px">
              {categories?.map((category) => {
                return (
                  <MenuItem
                    key={category.id}
                    h="30px"
                    color="#1e2026"
                    _hover={{ color: '#fff', bg: '#1e2026' }}
                    onClick={() => {
                      onChangeCategory(category.name);
                    }}
                  >
                    {category.name}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Box ml="10px" as="span" color="#1e2026">
            {`select category: ${category}`}
          </Box>
        </InputCon>
        <Box h={10}></Box>

        <ItemTittle alignItems={'center'} justifyContent={'space-between'}>
          Thumbnail URL
          <span>Use Greenfield Universal Endpoint or other public url</span>
        </ItemTittle>
        <Box h={10}></Box>
        <InputCon>
          <Input
            value={imgUrl}
            onChange={onChangeImgUrl}
            placeholder="Please enter an url..."
          ></Input>
        </InputCon>
        <Box h={32}></Box>
        <FeeCon flexDirection={'column'} justifyContent={'space-between'}>
          <BottomInfo>
            <ItemCon alignItems={'center'} justifyContent={'space-between'}>
              <ItemSubTittle>
                Gas fee to edit <ColoredWarningIcon size="sm" color="#AEB4BC" />
              </ItemSubTittle>
              <BalanceCon flexDirection={'column'} alignItems={'flex-end'}>
                {simLoading ? (
                  <Loader size={24}></Loader>
                ) : (
                  <>
                    <Fee>{simulateInfo?.gasFee || '-'} BNB</Fee>
                    {GF_FEE_SUFF ? (
                      <Balance>
                        Greenfield Balance: {roundFun(GfBalanceVal, 8)} BNB{' '}
                      </Balance>
                    ) : (
                      <BalanceWarn
                        gap={5}
                        alignItems={'center'}
                        justifyContent={'center'}
                      >
                        <ColoredWarningIcon size="sm" color="#ff6058" />{' '}
                        Insufficient Greenfield Balance
                      </BalanceWarn>
                    )}
                  </>
                )}
              </BalanceCon>
            </ItemCon>
          </BottomInfo>
        </FeeCon>
      </CustomBody>
      <ModalFooter>
        <FooterCon flexDirection={'column'} gap={6}>
          {chain && chain.id === GF_CHAIN_ID && (
            <Button
              width={'100%'}
              onClick={async () => {
                try {
                  setLoading(true);
                  await edit(address as string, itemInfo.groupName, extraStr);
                  toast.success({
                    description: 'edit success',
                    duration: 3000,
                  });
                } catch (error) {
                  toast.error({ description: 'edit failed', duration: 3000 });
                }
                setLoading(false);
                // updateFn?.();
                refetch();
                handleOpen(false);
              }}
              disabled={!GF_FEE_SUFF || INFO_NO_CHANGE || loading}
              isLoading={loading}
            >
              Confirm
            </Button>
          )}
          {chain && chain.id !== GF_CHAIN_ID ? (
            <Button
              width={'100%'}
              onClick={async () => {
                switchNetwork?.(GF_CHAIN_ID);
              }}
            >
              Switch to Greenfield
            </Button>
          ) : null}
        </FooterCon>
      </ModalFooter>
    </Container>
  );
};

const Container = styled(Modal)`
  .ui-modal-content {
    background: #ffffff;
  }
`;
const Header = styled(ModalHeader)`
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  display: flex;
  align-items: center;
  text-align: center;

  color: #000000;
`;

const CustomBody = styled(ModalBody)`
  height: 380px;
`;

const ItemTittle = styled(Flex)`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;

  color: #1e2026;

  span {
    color: #76808f;
  }
`;

const ResourceNameCon = styled(Flex)`
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;

  color: #000000;
`;

const Tag = styled(Flex)`
  margin-left: 16px;

  font-style: normal;
  font-weight: 400;
  font-size: 8px;
  line-height: 28px;

  width: 73px;
  height: 16px;

  background: #d9d9d9;

  border-radius: 16px;
`;

const InputCon = styled.div`
  .ui-input,
  .ui-textarea {
    background: #ffffff;
    /* readable/border */

    border: 1px solid #e6e8ea;
    border-radius: 8px;
    color: #aeb4bc;
  }
`;
const FeeCon = styled(Flex)`
  padding: 16px;

  width: 100%;
  height: 75px;

  border: 1px solid #e6e8ea;
  border-radius: 8px;
`;

const BottomInfo = styled.div``;
const ItemCon = styled(Flex)`
  height: 40px;
`;
const ItemSubTittle = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #1e2026;
`;

const BalanceCon = styled(Flex)``;

const Fee = styled.div`
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;

  color: #1e2026;
`;

const Balance = styled.div`
  text-align: right;

  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 18px;

  color: #696a6c;
`;

const BalanceWarn = styled(Flex)`
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 18px;
  /* identical to box height, or 180% */

  color: #ff6058;
`;

const FooterCon = styled(Flex)`
  width: 100%;
`;

const CustomMenuButton = forwardRef(
  (props: { children: ReactNode }, ref: ForwardedRef<HTMLButtonElement>) => {
    const { children, ...restProps } = props;

    return (
      <Button
        size="sm"
        ref={ref}
        // background={'#373943'}
        variant="ghost"
        justifyContent="space-between"
        px={12}
        fontWeight={600}
        fontSize={14}
        h="30px"
        lineHeight={'30px'}
        color="#76808f"
        // border="1px solid #5C5F6A"
        borderColor="#76808f"
        mt="5px"
        borderRadius={8}
        _hover={{
          color: '#FFF',
          background: '#1e2026',
        }}
        _expanded={{
          '.close-icon': {
            transform: 'rotate(-180deg)',
          },
        }}
        {...restProps}
      >
        select category
      </Button>
    );
  },
);
