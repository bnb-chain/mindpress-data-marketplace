import styled from '@emotion/styled';
import { Flex } from '@totejs/uikit';
import { useAccount } from 'wagmi';
import { useGetItemRelationWithAddr } from '../hooks/useGetItemRelationWithAddr';
import { useModal } from '../hooks/useModal';
import { useWalletModal } from '../hooks/useWalletModal';
import { Item } from '../utils/apis/types';
import { OwnActionCom } from './OwnActionCom';
import { YellowButton } from './ui/buttons/YellowButton';

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
        <YellowButton
          onClick={async () => {
            modalData.modalDispatch({
              type: 'OPEN_BUY',
              buyData: data,
            });
          }}
        >
          Buy
        </YellowButton>
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
        <YellowButton
          onClick={() => {
            if (!isConnected && !isConnecting) handleModalOpen();
          }}
        >
          Buy
        </YellowButton>
      )}
    </ButtonCon>
  );
};
const ButtonCon = styled(Flex)``;
