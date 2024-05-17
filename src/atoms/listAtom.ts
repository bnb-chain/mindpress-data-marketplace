import { atomWithImmer } from 'jotai-immer';

interface IListAtom {
  open: boolean;
  data: {
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
    bucketId: BigInt(0),
    objectId: BigInt(0),
    price: BigInt(0),
    imageUrl: '',
    desc: '',
    categoryId: 100,
  },
});
