import styled from '@emotion/styled';
import { PenIcon } from '@totejs/icons';
import { Flex } from '@totejs/uikit';
import { useState } from 'react';
import { ITEM_RELATION_ADDR } from '../../hooks/useGetItemRelationWithAddr';
import { defaultImg } from '../../utils';
import { Item } from '../../utils/apis/types';
import { reportEvent } from '../../utils/ga';
import { EditModal } from '../modal/EditModal';
import { SellIcon } from '../svgIcon/SellIcon';

interface Props {
  itemInfo: Item;
  relation: ITEM_RELATION_ADDR;
}

export const ImgCon = (props: Props) => {
  const { itemInfo, relation } = props;
  const [open, setOpen] = useState(false);

  return (
    <Container>
      <img src={itemInfo?.url || defaultImg(itemInfo?.name, 246)} alt="" />
      {relation !== 'NOT_PURCHASE' && relation !== 'UNKNOWN' && (
        <Cover alignItems={'center'} justifyContent="flex-end" p="16px">
          {relation === 'PURCHASED' && (
            <Flex
              alignItems="center"
              gap="8px"
              color="#181A1E"
              bg="#53EAA1"
              borderRadius="40px"
              p="8px 12px"
              fontSize="16px"
              fontWeight={600}
            >
              <SellIcon w={24} color="#181A1E" /> PURCHASED
            </Flex>
          )}

          {relation === 'OWNER' && (
            <Flex
              alignItems="center"
              gap="8px"
              color="#181A1E"
              bg="#F1F2F3"
              borderRadius="40px"
              p="8px 12px"
              fontSize="16px"
              fontWeight={600}
              cursor="pointer"
              onClick={() => {
                setOpen(true);
              }}
            >
              <PenIcon w={24} color="#181A1E" /> Edit
            </Flex>
          )}
        </Cover>
      )}

      {open && (
        <EditModal
          isOpen={open}
          handleOpen={() => {
            reportEvent({ name: 'dm.detail.overview.edit.click' });
            setOpen(false);
          }}
          itemInfo={itemInfo}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;

  img {
    object-fit: cover;
    width: 486px;
    height: 486px;

    background-color: #d9d9d9;
    border-radius: 8px;
  }
`;

const Cover = styled(Flex)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: linear-gradient(
    180deg,
    rgba(24, 26, 30, 0.8) 0%,
    rgba(25, 27, 31, 0) 100%
  );
`;
