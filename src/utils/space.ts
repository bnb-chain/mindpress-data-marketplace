import { Address } from 'viem';

export const getSpaceName = (address?: Address) => {
  return 'mindpress' + address;
};
