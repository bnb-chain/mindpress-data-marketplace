import { atomWithImmer } from 'jotai-immer';
import { Item } from '../utils/apis/types';

interface IDelistAtom {
  openDelist: boolean;
  delistData: Pick<Item, 'groupId' | 'name' | 'createdAt' | 'ownerAddress'>;
}

export const delistAtom = atomWithImmer<IDelistAtom>({
  openDelist: false,
  delistData: {
    createdAt: 0,
    groupId: 0,
    name: '',
    ownerAddress: '',
  },
});
