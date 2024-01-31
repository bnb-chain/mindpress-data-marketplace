import { atomWithImmer } from 'jotai-immer';
import { Item } from '../utils/apis/types';

interface IDelistAtom {
  openDelist: boolean;
  delistData: Item;
}

export const delistAtom = atomWithImmer<IDelistAtom>({
  openDelist: false,
  delistData: {} as Item,
});
