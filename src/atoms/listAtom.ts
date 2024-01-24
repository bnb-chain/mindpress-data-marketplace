import { atomWithImmer } from 'jotai-immer';

interface IListAtom {
  openList: boolean;
  initInfo: {
    bucket_name: string;
    object_name: string;
    create_at: number;
    payload_size: number;
  };
}

export const listAtom = atomWithImmer<IListAtom>({
  openList: false,
  initInfo: {
    bucket_name: '',
    object_name: '',
    create_at: 0,
    payload_size: 0,
  },
});
