import { Button, ButtonProps } from '@totejs/uikit';

export const BigYellowButton = (props: ButtonProps) => {
  return (
    <Button
      h="50px"
      w="120px"
      size={'sm'}
      fontSize="16px"
      fontWeight={600}
      p="8px 16px"
      {...YellowProps}
      {...props}
    />
  );
};

const YellowProps = {
  background: '#FFE900',
  color: '#181A1E',
  _hover: {
    bg: '#EBD600',
    color: '#181A1E',
  },
  _active: {
    bg: '#FFF15C',
    color: '#181A1E',
  },
};

export const YellowButton = (props: ButtonProps) => {
  return (
    <Button
      size={'sm'}
      h="32px"
      fontSize="14px"
      p="8px 16px"
      fontWeight={600}
      {...YellowProps}
      {...props}
    />
  );
};

const BlackProps = {
  background: '#14151A',
  color: '#FFF',
  _hover: {
    bg: 'rgba(20, 21, 26, 0.9)',
    color: '#FFF',
  },
  _active: {
    bg: 'rgba(20, 21, 26, 0.9)',
    color: '#FFF',
  },
};

export const BlackButton = (props: ButtonProps) => {
  return (
    <Button
      size={'sm'}
      h="48px"
      fontSize="14px"
      p="8px 16px"
      fontWeight={600}
      borderRadius="8px"
      {...BlackProps}
      {...props}
    />
  );
};
