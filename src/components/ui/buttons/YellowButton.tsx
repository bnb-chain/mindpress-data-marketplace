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
