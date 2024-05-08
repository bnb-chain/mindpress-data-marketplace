import { atomWithImmer } from 'jotai-immer';
import { atomWithReset } from 'jotai/utils';

export type Status = 'init' | 'uploading' | 'success' | 'fail';

type UploadAtomType = {
  filesProgress: {
    progress: number;
  }[];
  thumbProgress: {
    progress: number;
  }[];
  status: Status;
};

export const UploadAtom = atomWithImmer<UploadAtomType>({
  filesProgress: [],
  thumbProgress: [],
  status: 'init',
});

export const resetUpload = atomWithReset(UploadAtom);
