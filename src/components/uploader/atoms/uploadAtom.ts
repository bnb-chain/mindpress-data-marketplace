import { atomWithImmer } from 'jotai-immer';
import { atomWithReset } from 'jotai/utils';

export type Status = 'init' | 'uploading' | 'success' | 'fail';

type UploadAtomType = {
  files: {
    width: number;
    height: number;
  }[];
  filesProgress: {
    progress: number;
  }[];
  thumbProgress: {
    progress: number;
  }[];
  status: Status;
};

export const UploadAtom = atomWithImmer<UploadAtomType>({
  files: [],
  filesProgress: [],
  thumbProgress: [],
  status: 'init',
});

export const resetUpload = atomWithReset(UploadAtom);
