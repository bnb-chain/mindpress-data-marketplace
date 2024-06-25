import styled from '@emotion/styled';
import { Flex } from '@totejs/uikit';
import { ReactNode, useCallback } from 'react';
import { ConnectorData, useAccount } from 'wagmi';
import { useModal } from '../../hooks/useModal';
import { useOffchainAuth } from '../../hooks/useOffchainAuth';
import { ActionResult } from '../modal/ActionResult';
import { BuyModal } from '../modal/BuyModal';
import { ListModal } from '../modal/ListModal';
import { UploadObjectModal } from '../modal/UploadObject';
import Footer from './Footer';
import Header from './Header';
import { useSwitchAccount } from '../../hooks/useSwitchAccount';

export default function Layout({ children }: { children: ReactNode }) {
  const modalData = useModal();
  const { applyOffchainAuthData } = useOffchainAuth();

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

  const { connector } = useAccount({
    onConnect: async ({ connector, address }) => {
      applyOffchainAuthData({ connector, address });
    },
  });

  useSwitchAccount(connector, ({ account }: ConnectorData) => {
    // console.log('xx', xx);
    if (account) {
      console.log('new account', account);
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
