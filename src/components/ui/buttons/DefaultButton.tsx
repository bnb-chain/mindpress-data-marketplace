import styled from '@emotion/styled';
import { Button, ButtonProps } from '@totejs/uikit';

export const DefaultButton = (props: ButtonProps) => {
  return (
    <BaseButton
      variant="ghost"
      _disabled={{
        color: 'rgba(24, 26, 30, 0.45)',
        background: 'rgba(247, 247, 248, 0.45)',
        cursor: 'not-allowed',
        _hover: {
          color: 'rgba(24, 26, 30, 0.45)',
          background: 'rgba(247, 247, 248, 0.45)',
        },
      }}
      {...props}
    />
  );
};

export const BaseButton = styled(Button)`
  font-size: 14px;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 8px;
  border: 1px solid #f1f2f3;

  &:hover {
    background: #f1f2f3;
    color: #181a1e;
  }

  &:active {
    background: #ffffff;
    color: #181a1e;
  }
`;
