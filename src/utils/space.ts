import { Address } from 'viem';

export const getSpaceName = (address?: Address) => {
  return 'mindpress-' + address?.toLocaleLowerCase();
};

export const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
