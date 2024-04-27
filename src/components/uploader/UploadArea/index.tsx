import {
  Box,
  Center,
  Flex,
  HStack,
  IconButton,
  CircularProgress,
  CircularProgressLabel,
  Stack,
} from '@totejs/uikit';
import React from 'react';
import { UploadFileIcon } from '../../svgIcon/UploadFile';
import { parseFileSize } from '../../../utils';
import { CloseIcon } from '@totejs/icons';
import { useImmerAtom } from 'jotai-immer';
import { UploadAtom } from '../atoms/uploadAtom';
import { Progress } from '../Porgress';

interface IProps {
  files: File[] | null;
  removeFile: (index: number) => void;
}

export const UploadArea: React.FC<IProps> = ({ files, removeFile }) => {
  const [uploadInfo, _] = useImmerAtom(UploadAtom);
  const fileList = files ? [...files] : [];
  const totalFileSize = fileList.reduce((a, b) => a + b.size, 0);

  return (
    <>
      {files && uploadInfo.status == 'uploading' && (
        <Flex justifyContent="space-between">
          <Box>Total Upload:</Box>
          <Box color="#1E2026" fontWeight="700">
            {parseFileSize(totalFileSize)} / {fileList.length} Objects
          </Box>
        </Flex>
      )}

      <Box
        maxH="325px"
        overflowY="scroll"
        overflowX="hidden"
        sx={{
          '::-webkit-scrollbar': {
            width: '4px',
          },
          '::-webkit-scrollbar-track': {},
          '::-webkit-scrollbar-thumb': {
            bg: '#f1f1f1',
          },
        }}
      >
        {fileList.map((file, index) => {
          return (
            <Flex
              gap="16px"
              key={file.name + file.lastModified}
              justifyContent="space-between"
              alignItems="center"
              py="12px"
            >
              <HStack gap="16px">
                <Box flex="1">
                  <Center
                    w="40px"
                    h="40px"
                    border="1px solid #E6E8EA"
                    overflow="hidden"
                    borderRadius="100%"
                  >
                    <UploadFileIcon />
                  </Center>
                </Box>
                <Box>
                  <Box fontSize="14px" fontWeight="700" color="#1E2026">
                    {file.name}
                  </Box>
                  <Box fontSize="14px" color="#76808F">
                    {parseFileSize(file.size)}
                  </Box>
                </Box>
              </HStack>

              {uploadInfo.status == 'init' && (
                <IconButton
                  w="16px"
                  h="16px"
                  variant="text"
                  icon={<CloseIcon color="#76808F" />}
                  onClick={() => {
                    removeFile(index);
                  }}
                />
              )}

              {uploadInfo.status !== 'init' && (
                <Progress
                  progress={uploadInfo.filesProgress[index]?.progress || 0}
                />
              )}
            </Flex>
          );
        })}
      </Box>
    </>
  );
};
