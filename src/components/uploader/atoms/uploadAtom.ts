import { atomWithImmer } from 'jotai-immer';
import { atomWithReset, useResetAtom } from 'jotai/utils';

export type Status = 'init' | 'uploading' | 'success' | 'fail';

type UploadAtomType = {
  filesProgress: {
    progress: number;
  }[];
  status: Status;
};

export const UploadAtom = atomWithImmer<UploadAtomType>({
  filesProgress: [],
  status: 'init',
});

export const resetUpload = atomWithReset(UploadAtom);
