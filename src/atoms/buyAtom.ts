import { atom } from 'jotai';

interface IBuyAtom {
  // openDrawer: boolean;
  buying: boolean;
}

export const buyAtom = atom<IBuyAtom>({
  // openDrawer: false,
  buying: false,
});
