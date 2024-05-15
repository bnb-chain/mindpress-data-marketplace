import { Address } from 'viem';

export const getSpaceName = (address?: Address) => {
  const add = address?.toLocaleLowerCase().replace('0x', '');
  if (!add) return '';

  return 'md-' + add.slice(0, 6) + '-' + add.slice(-4);
};

export const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};
