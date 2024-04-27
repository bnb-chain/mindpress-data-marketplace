import { atomWithImmer } from 'jotai-immer';

export interface IUploadObjectAtom {
  openModal: boolean;
}

export const uploadObjcetAtom = atomWithImmer<IUploadObjectAtom>({
  openModal: false,
});
