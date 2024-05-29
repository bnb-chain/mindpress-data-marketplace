import styled from '@emotion/styled';
import { Modal, ModalBody, ModalCloseButton, ModalHeader } from '@totejs/uikit';
import { useImmerAtom } from 'jotai-immer';
import { uploadObjcetAtom } from '../../../atoms/uploadObjectAtom';
import { Uploader } from '../../uploader';
import { UploadAtom } from '../../uploader/atoms/uploadAtom';
import { useCallback } from 'react';

export const UploadObjectModal = () => {
  const [upobjs, setUpobjs] = useImmerAtom(uploadObjcetAtom);
  const [uploadInfo, setUploadInfo] = useImmerAtom(UploadAtom);

  const handleCloseModal = useCallback(() => {
    setUpobjs((draft) => {
      draft.openModal = false;
    });

    // reset upload info
    setUploadInfo((draft) => {
      draft.filesProgress = [];
      draft.thumbProgress = [];
      draft.status = 'init';
    });
  }, [setUploadInfo, setUpobjs]);

  return (
    <Container
      size={'lg'}
      isOpen={upobjs.openModal}
      onClose={handleCloseModal}
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      {/* <ModalCloseButton /> */}
      <Header>Upload Images</Header>
      <ModalBody>
        <Uploader onClose={handleCloseModal} />
      </ModalBody>
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
  font-size: 24px;
  line-height: 28px;

  display: flex;
  align-items: center;
  color: #000000;
  justify-content: start;
`;
