import styled from '@emotion/styled';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from '@totejs/uikit';
import { useAtom } from 'jotai';
import { uploadObjcetAtom } from '../../../atoms/uploadObjectAtom';
import { DefaultButton } from '../../ui/buttons/DefaultButton';
import { BlackButton, BlackSolidButton } from '../../ui/buttons/BlackButton';
import NiceModal from '@ebay/nice-modal-react';
import { Tips } from '../Tips';
import { Uploader } from '../../uploader';
import { useImmerAtom } from 'jotai-immer';
import { UploadAtom } from '../../uploader/atoms/uploadAtom';

export const UploadObjectModal = () => {
  const [upobjs, setUpobjs] = useImmerAtom(uploadObjcetAtom);
  const [uploadInfo, setUploadInfo] = useImmerAtom(UploadAtom);

  const handleCloseModal = () => {
    setUpobjs((draft) => {
      draft.openModal = false;
    });

    // reset upload info
    setUploadInfo((draft) => {
      draft.filesProgress = [];
      draft.status = 'init';
    });
  };

  return (
    <Container size={'lg'} isOpen={upobjs.openModal} onClose={handleCloseModal}>
      <ModalCloseButton />
      <Header>Upload Objects</Header>
      <ModalBody>
        <Uploader />
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
