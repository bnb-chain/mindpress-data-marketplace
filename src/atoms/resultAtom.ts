import { StateModalVariantType } from '@totejs/uikit';
import { atomWithImmer } from 'jotai-immer';

interface IResultAtom {
  openResult: boolean;
  result: {
    variant: StateModalVariantType;
    description: string;
  };
}

export const resultAtom = atomWithImmer<IResultAtom>({
  openResult: false,
  result: {
    variant: 'info',
    description: '',
  },
});
