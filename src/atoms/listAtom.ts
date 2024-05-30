import { atomWithImmer } from 'jotai-immer';

export interface IListAtom {
  open: boolean;
  data: {
    name: string;
    bucketId: bigint;
    objectId: bigint;
    price: bigint;
    imageUrl: string;
    desc: string;
    categoryId: number;
  };
}

export const listAtom = atomWithImmer<IListAtom>({
  open: false,
  data: {
    name: '',
    bucketId: BigInt(0),
    objectId: BigInt(0),
    price: BigInt(0),
    imageUrl: '',
    desc: '',
    categoryId: 100,
  },
});
