import styled from '@emotion/styled';
import { Button, Flex } from '@totejs/uikit';
import { useAccount } from 'wagmi';
import { BuyData } from '../context/modal';
import { useModal } from '../hooks/useModal';
import { useStatus } from '../hooks/useStatus';
import { useWalletModal } from '../hooks/useWalletModal';
import { OwnActionCom } from './OwnActionCom';
import { Item } from '../utils/apis/types';
import { useGetItemRelationWithAddr } from '../hooks/useGetItemRelationWithAddr';

interface IActionCom {
  data: Item;
  address: string;
  from?: string;
}
export const ActionCom = (obj: IActionCom) => {
  const { data, address } = obj;
  const { id, groupName, ownerAddress, type } = data;
  const { isConnected, isConnecting } = useAccount();
  const relation = useGetItemRelationWithAddr(address, data);

  const { handleModalOpen } = useWalletModal();

  const modalData = useModal();
  return (
    <ButtonCon gap={6}>
      {relation == 'NOT_PURCHASE' && (
        <Button
          size={'sm'}
          background="#665800"
          color="#FFE900"
          h="32px"
          fontSize="14px"
          p="8px 16px"
          onClick={async () => {
            // if (from === 'home')
            //   reportEvent({ name: 'dm.main.list.buy.click' });
            modalData.modalDispatch({
              type: 'OPEN_BUY',
              buyData: data,
            });
          }}
        >
          Buy
        </Button>
      )}
      {(relation == 'OWNER' || relation == 'PURCHASED') && (
        <OwnActionCom
          data={{
            id,
            groupName,
            ownerAddress,
            type,
          }}
          address={address}
        ></OwnActionCom>
      )}
      {relation === 'UNKNOWN' && (
        <Button
          size={'sm'}
          background="#665800"
          color="#FFE900"
          h="32px"
          fontSize="14px"
          p="8px 16px"
          onClick={() => {
            if (!isConnected && !isConnecting) handleModalOpen();
          }}
        >
          Buy
        </Button>
      )}
    </ButtonCon>
  );
};
const ButtonCon = styled(Flex)``;
