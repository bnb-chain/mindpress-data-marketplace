import styled from '@emotion/styled';
import { Button, Flex } from '@totejs/uikit';
import { useAccount } from 'wagmi';
import { BuyData } from '../context/modal';
import { useModal } from '../hooks/useModal';
import { useStatus } from '../hooks/useStatus';
import { useWalletModal } from '../hooks/useWalletModal';
import { OwnActionCom } from './OwnActionCom';

interface IActionCom {
  data: BuyData;
  address: string;
  from?: string;
}
export const ActionCom = (obj: IActionCom) => {
  const { data, address, from } = obj;
  const { id, groupName, ownerAddress, type } = data;
  const { isConnected, isConnecting } = useAccount();

  const { status } = useStatus(groupName, ownerAddress, address);
  const { handleModalOpen } = useWalletModal();

  const modalData = useModal();
  return (
    <ButtonCon gap={6}>
      {status == 1 && (
        <Button
          size={'sm'}
          background="#665800"
          color="#FFE900"
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
      {(status == 0 || status == 2) && (
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
      {status === -1 && (
        <Button
          size={'sm'}
          background="#665800"
          color="#FFE900"
          fontSize="14px"
          fontWeight="600"
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
