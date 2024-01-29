import { atomWithImmer } from 'jotai-immer';
import { Item } from '../utils/apis/types';

interface IBuyAtom {
  openDrawer: boolean;
  buying: boolean;
  buyData: Item;
  callback?: () => any;
}

export const buyAtom = atomWithImmer<IBuyAtom>({
  openDrawer: false,
  buying: false,
  buyData: {} as Item,
});
