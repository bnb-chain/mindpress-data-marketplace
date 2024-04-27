import { Box, Stack } from '@totejs/uikit';
import { SuccessIcon } from '../../svgIcon/SuccessIcon';
import { ColoredSuccessIcon } from '@totejs/icons';

interface IProps {
  progress: number;
}

export const Progress: React.FC<IProps> = ({ progress }) => {
  if (progress == 100) {
    return (
      <Box color="#FFF">
        <ColoredSuccessIcon />
      </Box>
    );
  }

  return (
    <Stack mr="32px">
      <Box color="#AEB4BC" fontSize="12px">
        {progress || 0}%
      </Box>
      <Box
        bg="#F5F5F5"
        w="144px"
        pos="relative"
        h="4px"
        borderRadius="2px"
        overflow="hidden"
      >
        <Box
          pos="absolute"
          left="0"
          h="4px"
          w={`${progress}%`}
          bg="#1184EE"
        ></Box>
      </Box>
    </Stack>
  );
};
