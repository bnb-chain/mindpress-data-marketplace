import styled from '@emotion/styled';
import { Flex } from '@totejs/uikit';
import { ReactNode, useCallback } from 'react';
import { useModal } from '../../hooks/useModal';
import { ActionResult } from '../modal/ActionResult';
import { DelistModal } from '../modal/DelistModal';
import { ListModal } from '../modal/ListModal';
import { ListProcess } from '../modal/ListProcess';
import { BuyModal } from '../modal/BuyModal';
import Footer from './Footer';
import Header from './Header';
import { UploadObjectModal } from '../modal/UploadObject';

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

  const handleListOpen = useCallback(() => {
    modalData.modalDispatch({ type: 'CLOSE_LIST' });
  }, [modalData]);

  const handleListProcessOpen = useCallback(() => {
    modalData.modalDispatch({ type: 'CLOSE_LIST_PROCESS' });
  }, [modalData]);

  const handleDelistOpen = useCallback(() => {
    modalData.modalDispatch({ type: 'CLOSE_DELIST' });
  }, [modalData]);

  const handleResultOpen = useCallback(() => {
    modalData.modalDispatch({ type: 'CLOSE_RESULT' });
  }, [modalData]);

  return (
    <>
      <Container flexDirection={'column'} justifyContent={'space-between'}>
        <Header />
        <Main>{children}</Main>
        <Footer />
      </Container>

      {openList && (
        <ListModal
          isOpen={openList}
          handleOpen={() => {
            handleListOpen();
          }}
          detail={initInfo}
        ></ListModal>
      )}

      {openListProcess && (
        <ListProcess
          isOpen={openListProcess}
          handleOpen={() => {
            handleListProcessOpen();
          }}
        ></ListProcess>
      )}

      <BuyModal />

      <DelistModal
        isOpen={openDelist}
        handleOpen={() => {
          handleDelistOpen();
        }}
      ></DelistModal>

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
