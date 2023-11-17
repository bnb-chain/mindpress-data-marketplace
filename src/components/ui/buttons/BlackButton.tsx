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
