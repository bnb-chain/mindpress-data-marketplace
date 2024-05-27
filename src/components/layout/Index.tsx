import styled from '@emotion/styled';
import { Flex } from '@totejs/uikit';
import { useSetAtom } from 'jotai';
import { ReactNode, useCallback } from 'react';
import { Address, Connector, ConnectorData, useAccount } from 'wagmi';
import { offchainDataAtom } from '../../atoms/offchainDataAtomAtom';
import { useModal } from '../../hooks/useModal';
import { getOffchainAuthKeys } from '../../utils/off-chain-auth/utils';
import { ActionResult } from '../modal/ActionResult';
import { BuyModal } from '../modal/BuyModal';
import { ListModal } from '../modal/ListModal';
import { UploadObjectModal } from '../modal/UploadObject';
import Footer from './Footer';
import Header from './Header';
import { useSwitchAccount } from '../../hooks/useSwitchAccount';

export default function Layout({ children }: { children: ReactNode }) {
  const modalData = useModal();

  const {
    openList,
    initInfo,
    openListProcess,
    openDelist,
    openResult,
    result,
    callBack,
  } = modalData.modalState;

  const handleResultOpen = useCallback(() => {
    modalData.modalDispatch({ type: 'CLOSE_RESULT' });
  }, [modalData]);

  const setOffchainData = useSetAtom(offchainDataAtom);

  const applyOffchainAuthData = async ({
    connector,
    address,
  }: {
    connector?: Connector;
    address?: Address;
  }) => {
    const provider = await connector?.getProvider();
    // console.log('provider', provider);
    const offChainData = await getOffchainAuthKeys(
      address as Address,
      provider,
    );
    // console.log('useAccount offChainData', offChainData);
    setOffchainData({
      address: address!,
      seed: offChainData?.seedString,
    });
  };

  const { connector } = useAccount({
    onConnect: async ({ connector, address }) => {
      applyOffchainAuthData({ connector, address });
    },
  });

  useSwitchAccount(connector, ({ account }: ConnectorData) => {
    // console.log(account);
    if (account) {
      // console.log('new account', account);
      applyOffchainAuthData({ connector, address: account });
    }
  });

  return (
    <>
      <Container flexDirection={'column'} justifyContent={'space-between'}>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </Container>

      <ListModal />

      <BuyModal />

      <ActionResult
        isOpen={openResult}
        handleOpen={() => {
          handleResultOpen();
        }}
        callBack={callBack}
        {...result}
      ></ActionResult>

      <UploadObjectModal />
    </>
  );
}

const Main = styled.main`
  /* display: flex; */
  /* flex: 1 1 0%; */
  /* justify-content: center; */
  margin-top: 80px;
`;

const Container = styled(Flex)`
  background-color: #14151a;
  min-height: 100vh;
`;
