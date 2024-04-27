import { Box, Center, Input, Text, VStack } from '@totejs/uikit';
import React, { useRef } from 'react';
import { DragFileIcon } from '../../svgIcon/DragFileIcon';

interface IProps {
  files: File[] | null;
  fileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dropChange: (e: DragEvent) => void;
}

export const DragBox: React.FC<IProps> = ({
  files,
  fileChange,
  dropChange,
}) => {
  const drop = useRef<HTMLDivElement | null>(null);

  const dragEnter = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const dragOver = (e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // setDragging(false);
  };

  React.useEffect(() => {
    drop && drop.current && drop.current.addEventListener('dragover', dragOver);
    drop && drop.current && drop.current.addEventListener('drop', dropChange);
    drop &&
      drop.current &&
      drop.current.addEventListener('dragenter', dragEnter);
    drop &&
      drop.current &&
      drop.current.addEventListener('dragleave', handleDragLeave);

    return () => {
      drop &&
        drop.current &&
        drop.current.removeEventListener('dragover', dragOver);
      drop &&
        drop.current &&
        drop.current.removeEventListener('drop', dropChange);
      drop &&
        drop.current &&
        drop.current.removeEventListener('dragenter', dragEnter);
      drop &&
        drop.current &&
        drop.current.removeEventListener('dragleave', handleDragLeave);
    };
  }, []);

  const hasFiles = files && files.length > 0;
  const boxHeight = hasFiles ? '56px' : '360px';
  const iconSize = hasFiles ? '24px' : '48px';

  return (
    <>
      <Box as="label" htmlFor="file" cursor="pointer">
        <Center
          as="div"
          ref={drop}
          flexDirection={hasFiles ? 'row' : 'column'}
          borderRadius="8px"
          border="1px dashed #AEB4BC"
          h={boxHeight}
          gap="8px"
        >
          <DragFileIcon w={iconSize} h={iconSize} />

          <Text fontSize="16px" color="#1E2026" fontWeight="700">
            Drag and drop here
          </Text>

          <Text fontSize="14px" color="#76808F">
            or{' '}
            <Box as="span" color="#1184EE">
              browse files
            </Box>
          </Text>
        </Center>
      </Box>
      <Input
        multiple
        id="file"
        type="file"
        accept="image/png, image/gif, image/jpeg"
        onChange={fileChange}
        sx={{
          visibility: 'hidden',
          pos: 'absolute',
        }}
      />
    </>
  );
};
