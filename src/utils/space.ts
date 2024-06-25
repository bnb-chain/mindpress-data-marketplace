import { Address } from 'viem';

export const getSpaceName = (address?: Address) => {
  const add = address?.toLocaleLowerCase().replace('0x', '');
  if (!add) return '';

  return 'md-' + add.slice(0, 6) + '-' + add.slice(-4);
};

function getFileExtension(filename: string) {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

export const THUMB = 'thumb';

// just simply object name
// because group name can not be too long more than 63 characters
export const shortObjectName = (fileName: string, extra: string) => {
  const extension = getFileExtension(fileName);
  return extra + '.' + extension;
};

export const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const getCompressImageSize = (width: number, height: number) => {
  const MAX_WIDTH = 1488;
  const MAX_HEIGHT = 1000;
  const ratio = MAX_WIDTH / MAX_HEIGHT;
  let w = width;
  let h = height;

  if (width / height > ratio) {
    w = MAX_WIDTH;
    h = width / ratio;
  } else {
    w = height * ratio;
    h = MAX_HEIGHT;
  }

  return {
    w: Math.floor(w),
    h: Math.floor(h),
  };
};
