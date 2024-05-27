import { Box } from '@totejs/uikit';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

interface LoadingProps {
  color?: string;
  bg?: string;
  minHeight?: number;
  size?: number;
  style?: React.CSSProperties;
  borderWidth?: number;
}

export const Loader = (props: LoadingProps) => {
  const {
    minHeight = 200,
    size = 40,
    style,
    color = '#ebd600',
    bg = '#14151a',
    borderWidth = 4,
  } = props;
  return (
    <Box
      style={style}
      width={'100%'}
      minHeight={minHeight}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <SpinImage
        style={{
          height: size,
          width: size,
          border: `${borderWidth}px solid ${color}`,
          borderBottomColor: bg,
        }}
      />
    </Box>
  );
};

const rotate = keyframes`
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
`;

const SpinImage = styled.div`
  animation: ${rotate} 1s linear infinite;
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite;
`;
