import { atomWithImmer } from 'jotai-immer';

interface IDelistAtom {
  openDelist: boolean;
  starting: boolean;
  params: {
    groupId: bigint;
  };
}

export const delistAtom = atomWithImmer<IDelistAtom>({
  openDelist: false,
  starting: false,
  params: {
    groupId: BigInt(0),
  },
});
