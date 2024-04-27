import { Button, ButtonProps } from '@totejs/uikit';

export const BlackButton = (props: ButtonProps) => {
  return (
    <Button
      h="32px"
      bg="none"
      color="#F1F2F3"
      border="1px solid #F1F2F3"
      fontSize="14px"
      p="8px 16px"
      _hover={{
        background: '#E1E2E5',
        color: '#181A1E',
      }}
      _active={{
        bg: '#FFFFFF',
        color: '#181A1E',
      }}
      {...props}
    />
  );
};

export const BlackSolidButton = (props: ButtonProps) => {
  return (
    <Button
      height="48px"
      bg="rgba(30, 32, 38, 1)"
      fontSize="16px"
      width={'100%'}
      _hover={{
        color: '#E1E2E5',
        bg: 'rgba(30, 32, 38, 0.98)',
      }}
      _active={{
        color: '#FFFFFF',
        bg: 'rgba(30, 32, 38, 0.95)',
      }}
      {...props}
    />
  );
};
